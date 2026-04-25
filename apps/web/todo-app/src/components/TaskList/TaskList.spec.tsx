import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { taskReducer, Task } from "@/redux/taskSlice";
import { TaskList } from "./TaskList";

function makeStore(tasks: Task[] = []) {
  return configureStore({ reducer: { tasks: taskReducer }, preloadedState: { tasks: { tasks } } });
}

const tasks = [
  { id: "1", title: "Buy milk", completed: false, createdAt: new Date().toISOString() },
  { id: "2", title: "Walk the dog", completed: true, createdAt: new Date().toISOString() },
];

function renderList(storeTasks = tasks) {
  const store = makeStore(storeTasks);
  return render(
    <Provider store={store}>
      <TaskList />
    </Provider>
  );
}

describe("TaskList", () => {
  it("renders empty state when there are no tasks", () => {
    renderList([]);
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it("renders all tasks", () => {
    renderList();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  });

  it("renders a list item for each task", () => {
    renderList();
    expect(screen.getAllByRole("listitem")).toHaveLength(tasks.length);
  });

  it("does not render empty state when tasks exist", () => {
    renderList();
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument();
  });
});
