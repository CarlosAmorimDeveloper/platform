"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTask, editTask, removeTask, Task } from "@/redux/taskSlice";
import { AppDispatch } from "@/redux/store";
import { Button } from "@ds/web/components/Button";
import { Input } from "@ds/web/components/Input";

interface TaskItemProps {
  task: Task;
}

const TITLE_ACTIVE = "flex-1 text-sm text-gray-800 cursor-pointer";
const TITLE_COMPLETED = "flex-1 text-sm text-gray-400 line-through cursor-default";

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
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white py-3 px-4 shadow-sm">
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
        <span
          className={task.completed ? TITLE_COMPLETED : TITLE_ACTIVE}
          role={task.completed ? undefined : "button"}
          tabIndex={task.completed ? undefined : 0}
          onDoubleClick={() => !task.completed && setIsEditing(true)}
          onKeyDown={task.completed ? undefined : handleSpanKeyDown}
          aria-label={task.completed ? task.title : `${task.title} — pressione Enter para editar`}
        >
          {task.title}
        </span>
      )}

      <div className="flex items-center gap-2">
        {!task.completed && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} aria-label="Editar tarefa">
            Editar
          </Button>
        )}
        <Button variant="danger" size="sm" onClick={handleRemove} aria-label="Remover tarefa">
          Remover
        </Button>
      </div>
    </li>
  );
}
