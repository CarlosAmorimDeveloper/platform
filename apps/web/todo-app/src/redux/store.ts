import { configureStore } from "@reduxjs/toolkit";
import { taskReducer } from "./taskSlice";

export const STORAGE_KEY = "todo-app:tasks";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

store.subscribe(() => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState().tasks));
  } catch {
    // storage quota or private mode — silently ignore
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;