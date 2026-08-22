import { fireEvent, renderWithStore, screen } from '@/test-utils';
import type { Task } from '@/redux/taskSlice';
import { TaskItem } from './TaskItem';

const task: Task = {
  id: 'task-1',
  title: 'Buy milk',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('TaskItem', () => {
  it('toggles completed when the checkbox is clicked', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.click(screen.getByLabelText(`Marcar "Buy milk" como completa`));

    expect(store.getState().tasks.tasks[0]?.completed).toBe(true);
  });

  it('shows the title struck through when completed', () => {
    const completed = { ...task, completed: true };
    renderWithStore(<TaskItem task={completed} />, { preloadedState: { tasks: [completed] } });

    expect(screen.getByText('Buy milk')).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('does not render the "Editar" button when completed', () => {
    const completed = { ...task, completed: true };
    renderWithStore(<TaskItem task={completed} />, { preloadedState: { tasks: [completed] } });

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('enters edit mode on double-click and saves on Enter', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.doubleClick(screen.getByText('Buy milk'));
    const input = screen.getByLabelText('Editar: Buy milk');
    fireEvent.change(input, { target: { value: 'Buy oat milk' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(store.getState().tasks.tasks[0]?.title).toBe('Buy oat milk');
  });

  it('enters edit mode via the "Editar" button', () => {
    renderWithStore(<TaskItem task={task} />, { preloadedState: { tasks: [task] } });

    fireEvent.click(screen.getByText('Editar'));

    expect(screen.getByLabelText('Editar: Buy milk')).toBeInTheDocument();
  });

  it('cancels edit mode on Escape without saving', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.doubleClick(screen.getByText('Buy milk'));
    const input = screen.getByLabelText('Editar: Buy milk');
    fireEvent.change(input, { target: { value: 'Something else' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByLabelText('Editar: Buy milk')).not.toBeInTheDocument();
    expect(store.getState().tasks.tasks[0]?.title).toBe('Buy milk');
  });

  it('saves on blur', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.doubleClick(screen.getByText('Buy milk'));
    const input = screen.getByLabelText('Editar: Buy milk');
    fireEvent.change(input, { target: { value: 'Buy oat milk' } });
    fireEvent.blur(input);

    expect(store.getState().tasks.tasks[0]?.title).toBe('Buy oat milk');
  });

  it('closes edit mode without dispatching when the title is unchanged', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fireEvent.doubleClick(screen.getByText('Buy milk'));
    fireEvent.keyDown(screen.getByLabelText('Editar: Buy milk'), { key: 'Enter' });

    expect(screen.queryByLabelText('Editar: Buy milk')).not.toBeInTheDocument();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('does not save an empty title', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.doubleClick(screen.getByText('Buy milk'));
    const input = screen.getByLabelText('Editar: Buy milk');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.blur(input);

    expect(store.getState().tasks.tasks[0]?.title).toBe('Buy milk');
  });

  it('enters edit mode via keyboard (Enter) on the title', () => {
    renderWithStore(<TaskItem task={task} />, { preloadedState: { tasks: [task] } });

    fireEvent.keyDown(screen.getByText('Buy milk'), { key: 'Enter' });

    expect(screen.getByLabelText('Editar: Buy milk')).toBeInTheDocument();
  });

  it('enters edit mode via keyboard (Space) on the title', () => {
    renderWithStore(<TaskItem task={task} />, { preloadedState: { tasks: [task] } });

    fireEvent.keyDown(screen.getByText('Buy milk'), { key: ' ' });

    expect(screen.getByLabelText('Editar: Buy milk')).toBeInTheDocument();
  });

  it('ignores unrelated keys on the title', () => {
    renderWithStore(<TaskItem task={task} />, { preloadedState: { tasks: [task] } });

    fireEvent.keyDown(screen.getByText('Buy milk'), { key: 'a' });

    expect(screen.queryByLabelText('Editar: Buy milk')).not.toBeInTheDocument();
  });

  it('removes the task when "Remover" is clicked', () => {
    const { store } = renderWithStore(<TaskItem task={task} />, {
      preloadedState: { tasks: [task] },
    });

    fireEvent.click(screen.getByText('Remover'));

    expect(store.getState().tasks.tasks).toHaveLength(0);
  });
});
