"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { TaskItem } from "../TaskItem/TaskItem";

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  if (tasks.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        Nenhuma tarefa ainda. Adicione uma acima!
      </Typography>
    );
  }

  return (
    <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </List>
  );
}
