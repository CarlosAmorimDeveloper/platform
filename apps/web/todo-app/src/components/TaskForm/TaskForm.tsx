"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask, Task } from "@/redux/taskSlice";
import { AppDispatch } from "@/redux/store";
import { Button } from "@ds/web/components/Button";
import { Input } from "@ds/web/components/Input";
import styles from "./TaskForm.module.scss";

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
    <form onSubmit={handleSubmit} aria-label="Task form" className={styles.form}>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isEditing ? "Editar tarefa…" : "Nova tarefa…"}
        aria-label={isEditing ? "Editar título da tarefa" : "Título da nova tarefa"}
        className={styles.input}
      />
      <Button type="submit" disabled={!value.trim()}>
        {isEditing ? "Salvar" : "Adicionar"}
      </Button>
      {isEditing && onDone && (
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
      )}
    </form>
  );
}
