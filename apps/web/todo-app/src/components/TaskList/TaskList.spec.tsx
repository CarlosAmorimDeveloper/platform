import { renderWithStore, screen } from '@/test-utils';
import type { Task } from '@/redux/taskSlice';
import { TaskList } from './TaskList';

const taskA: Task = {
  id: 'task-1',
  title: 'Buy milk',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
};
const taskB: Task = {
  id: 'task-2',
  title: 'Walk the dog',
  completed: true,
  createdAt: '2024-01-02T00:00:00.000Z',
};

describe('TaskList', () => {
  it('shows an empty state when there are no tasks', () => {
    renderWithStore(<TaskList />, { preloadedState: { tasks: [] } });

    expect(screen.getByText('Nenhuma tarefa ainda')).toBeInTheDocument();
  });

  it('renders one TaskItem per task', () => {
    renderWithStore(<TaskList />, { preloadedState: { tasks: [taskA, taskB] } });

    expect(screen.getByText('Buy milk')).toBeInTheDocument();
    expect(screen.getByText('Walk the dog')).toBeInTheDocument();
  });
});
