import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { taskReducer, Task } from "@/redux/taskSlice";
import { TaskForm } from "./TaskForm";

function makeStore() {
  return configureStore({ reducer: { tasks: taskReducer } });
}

const task: Task = { id: "1", title: "Buy milk", completed: false, createdAt: new Date().toISOString() };

function renderForm(props: { task?: Task; onDone?: () => void } = {}) {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <TaskForm {...props} />
    </Provider>
  );
}

describe("TaskForm — add mode", () => {
  it("renders input and Add button", () => {
    renderForm();
    expect(screen.getByRole("textbox", { name: /new task title/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("Add button is disabled when input is empty", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /add/i })).toBeDisabled();
  });

  it("Add button is enabled when input has text", () => {
    renderForm();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Walk the dog" } });
    expect(screen.getByRole("button", { name: /add/i })).toBeEnabled();
  });

  it("clears input after submit", () => {
    renderForm();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Walk the dog" } });
    fireEvent.submit(screen.getByRole("form", { name: /task form/i }));
    expect(input).toHaveValue("");
  });

  it("does not submit when input is blank/whitespace", () => {
    const onDone = jest.fn();
    renderForm({ onDone });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(onDone).not.toHaveBeenCalled();
  });
});

describe("TaskForm — edit mode", () => {
  it("renders input pre-filled with task title", () => {
    renderForm({ task });
    expect(screen.getByRole("textbox")).toHaveValue("Buy milk");
  });

  it("renders Save button instead of Add", () => {
    renderForm({ task });
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^add$/i })).not.toBeInTheDocument();
  });

  it("renders Cancel button when onDone is provided", () => {
    renderForm({ task, onDone: jest.fn() });
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onDone after save", () => {
    const onDone = jest.fn();
    renderForm({ task, onDone });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Buy eggs" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("calls onDone when Cancel is clicked", () => {
    const onDone = jest.fn();
    renderForm({ task, onDone });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
