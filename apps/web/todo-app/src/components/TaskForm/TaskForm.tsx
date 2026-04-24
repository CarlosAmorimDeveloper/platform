"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, editTask, Task } from "@/redux/taskSlice";
import { AppDispatch } from "@/redux/store";

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
    <form onSubmit={handleSubmit} aria-label="Task form" className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isEditing ? "Edit task…" : "New task…"}
        aria-label={isEditing ? "Edit task title" : "New task title"}
        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isEditing ? "Save" : "Add"}
      </button>
      {isEditing && onDone && (
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      )}
    </form>
  );
}
