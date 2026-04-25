import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { taskReducer, Task } from "@/redux/taskSlice";
import { TaskItem } from "./TaskItem";

function makeStore(tasks: Task[] = []) {
  return configureStore({ reducer: { tasks: taskReducer }, preloadedState: { tasks: { tasks } } });
}

const task = { id: "1", title: "Buy milk", completed: false, createdAt: new Date().toISOString() };
const completedTask = { ...task, completed: true };

function renderItem(t = task) {
  const store = makeStore([t]);
  return render(
    <Provider store={store}>
      <TaskItem task={t} />
    </Provider>
  );
}

describe("TaskItem", () => {
  it("renders task title", () => {
    renderItem();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("checkbox reflects completed state", () => {
    renderItem(completedTask);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("dispatches toggleTask on checkbox change", () => {
    renderItem();
    fireEvent.click(screen.getByRole("checkbox"));
    // no error = dispatch was called
  });

  it("enters edit mode on edit button click", () => {
    renderItem();
    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));
    expect(screen.getByRole("textbox", { name: /edit task title/i })).toBeInTheDocument();
  });

  it("submits edit on Enter key", () => {
    renderItem();
    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));
    const input = screen.getByRole("textbox", { name: /edit task title/i });
    fireEvent.change(input, { target: { value: "Buy eggs" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByRole("textbox", { name: /edit task title/i })).not.toBeInTheDocument();
  });

  it("cancels edit on Escape key", () => {
    renderItem();
    fireEvent.click(screen.getByRole("button", { name: /edit task/i }));
    const input = screen.getByRole("textbox", { name: /edit task title/i });
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("textbox", { name: /edit task title/i })).not.toBeInTheDocument();
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("dispatches removeTask on remove button click", () => {
    renderItem();
    fireEvent.click(screen.getByRole("button", { name: /remove task/i }));
    // no error = dispatch was called
  });

  it("hides edit button when task is completed", () => {
    renderItem(completedTask);
    expect(screen.queryByRole("button", { name: /edit task/i })).not.toBeInTheDocument();
  });
});
