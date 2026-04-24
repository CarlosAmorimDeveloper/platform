"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleTask, editTask, removeTask, Task } from "@/redux/taskSlice";
import { AppDispatch } from "@/redux/store";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

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

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        className="h-4 w-4 cursor-pointer accent-blue-500"
      />

      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Edit task title"
          className="flex-1 rounded border border-blue-400 px-2 py-0.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
      ) : (
        <span
          className={`flex-1 text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-800"} ${!task.completed ? "cursor-pointer" : ""}`}
          onDoubleClick={() => !task.completed && setIsEditing(true)}
          title={task.completed ? undefined : "Double-click to edit"}
        >
          {task.title}
        </span>
      )}

      <div className="flex items-center gap-2">
        {!task.completed && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="rounded px-2 py-1 text-xs text-blue-500 hover:bg-blue-50"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleRemove}
          aria-label="Remove task"
          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
