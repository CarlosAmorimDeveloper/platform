"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TaskItem } from "../TaskItem/TaskItem";

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400">No tasks yet. Add one above!</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
