"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, STORAGE_KEY } from "./store";
import { hydrateState } from "./taskSlice";
import type { Task, TaskState } from "./taskSlice";

function isValidTask(t: unknown): t is Task {
  if (!t || typeof t !== "object") return false;
  const task = t as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string"
  );
}

function isValidTaskState(data: unknown): data is TaskState {
  if (!data || typeof data !== "object") return false;
  const state = data as Record<string, unknown>;
  return Array.isArray(state.tasks) && state.tasks.every(isValidTask);
}

function StoreHydrator() {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (isValidTaskState(parsed)) {
        store.dispatch(hydrateState(parsed));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return null;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StoreHydrator />
      {children}
    </Provider>
  );
}
