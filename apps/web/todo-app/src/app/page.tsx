import { TaskForm, TaskList } from '@/components';

export default function Home() {
  return (
    <main className="mx-auto max-w-lg" style={{ padding: 'var(--space-12) var(--space-4)' }}>
      <h1 style={{ marginBottom: 'var(--space-8)' }}>Minhas Tarefas</h1>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <TaskForm />
      </div>
      <TaskList />
    </main>
  );
}
