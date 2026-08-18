import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { taskReducer } from '@/redux/taskSlice';
import { TaskForm } from './TaskForm';

function makeStore() {
  return configureStore({ reducer: { tasks: taskReducer } });
}

function renderForm() {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <TaskForm />
    </Provider>,
  );
}

describe('TaskForm', () => {
  it('renders input and Add button', () => {
    renderForm();
    expect(screen.getByRole('textbox', { name: /título da nova tarefa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
  });

  it('Add button is disabled when input is empty', () => {
    renderForm();
    expect(screen.getByRole('button', { name: /adicionar/i })).toBeDisabled();
  });

  it('Add button is enabled when input has text', () => {
    renderForm();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Walk the dog' } });
    expect(screen.getByRole('button', { name: /adicionar/i })).toBeEnabled();
  });

  it('clears input after submit', () => {
    renderForm();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Walk the dog' } });
    fireEvent.submit(screen.getByRole('form', { name: /task form/i }));
    expect(input).toHaveValue('');
  });

  it('does not submit when input is blank/whitespace', () => {
    renderForm();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.submit(input.closest('form')!);
    expect(input).toHaveValue('   ');
  });
});
