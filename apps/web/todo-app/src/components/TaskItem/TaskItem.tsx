"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTask, editTask, removeTask } from "@/redux/taskSlice";
import type { Task } from "@/redux/taskSlice";
import type { AppDispatch } from "@/redux/store";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Button } from "@ds/web/components/Button";
import { Input } from "@ds/web/components/Input";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  useEffect(() => {
    if (!isEditing) setEditValue(task.title);
  }, [task.title, isEditing]);

  function handleToggle() {
    dispatch(toggleTask(task.id));
  }

  function handleRemove() {
    dispatch(removeTask(task.id));
  }

  function handleEditSubmit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      dispatch(editTask({ id: task.id, title: trimmed }));
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleEditSubmit();
    if (e.key === "Escape") {
      setEditValue(task.title);
      setIsEditing(false);
    }
  }

  function handleSpanKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsEditing(true);
    }
  }

  return (
    <ListItem disablePadding>
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 1.5,
          px: 2,
          width: "100%",
          borderRadius: 1,
        }}
      >
        <Input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Marcar "${task.title}" como ${task.completed ? "incompleta" : "completa"}`}
        />

        {isEditing ? (
          <Input
            type="text"
            variant="inline"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label={`Editar: ${task.title}`}
            className="flex-1"
          />
        ) : (
          <Typography
            component="span"
            variant="body2"
            sx={{
              flex: 1,
              color: task.completed ? "text.disabled" : "text.primary",
              textDecoration: task.completed ? "line-through" : "none",
              cursor: task.completed ? "default" : "pointer",
            }}
            role={task.completed ? undefined : "button"}
            tabIndex={task.completed ? undefined : 0}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
            onKeyDown={task.completed ? undefined : handleSpanKeyDown}
            aria-label={
              task.completed
                ? task.title
                : `${task.title} — pressione Enter para editar`
            }
          >
            {task.title}
          </Typography>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          {!task.completed && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="Editar tarefa"
            >
              Editar
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            aria-label="Remover tarefa"
          >
            Remover
          </Button>
        </Stack>
      </Paper>
    </ListItem>
  );
}
