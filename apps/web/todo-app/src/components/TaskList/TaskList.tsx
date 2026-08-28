'use client';

import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { EmptyState } from '@industry/web';
import { TaskItem } from '../TaskItem/TaskItem';

export function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  if (tasks.length === 0) {
    return <EmptyState title="Nenhuma tarefa ainda" body="Adicione uma acima!" />;
  }

  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 0 }}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
