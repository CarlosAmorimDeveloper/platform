"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.scss";

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  if (tasks.length === 0) {
    return (
      <p className={styles.empty}>Nenhuma tarefa ainda. Adicione uma acima!</p>
    );
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
