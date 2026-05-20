"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask } from "@/redux/taskSlice";
import type { Task } from "@/redux/taskSlice";
import type { AppDispatch } from "@/redux/store";
import Stack from "@mui/material/Stack";
import { Button } from "@ds/web/components/Button";
import { Input } from "@ds/web/components/Input";

interface TaskFormProps {
  task?: Task;
  onDone?: () => void;
}

export function TaskForm({ task, onDone }: TaskFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState(task?.title ?? "");
  const isEditing = !!task;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    if (isEditing) {
      dispatch(editTask({ id: task.id, title: trimmed }));
    } else {
      dispatch(addTask({ title: trimmed }));
      setValue("");
    }

    onDone?.();
  }

  return (
    <Stack
      component="form"
      direction="row"
      spacing={1}
      onSubmit={handleSubmit}
      aria-label="Task form"
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isEditing ? "Editar tarefa…" : "Nova tarefa…"}
        aria-label={isEditing ? "Editar título da tarefa" : "Título da nova tarefa"}
        className="flex-1"
      />
      <Button type="submit" disabled={!value.trim()}>
        {isEditing ? "Salvar" : "Adicionar"}
      </Button>
      {isEditing && onDone && (
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
      )}
    </Stack>
  );
}
