import { TaskForm, TaskList } from '@/components';

export default function Home() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1
        style={{
          font: 'var(--weight-bold) var(--display-sm)/1.2 var(--font-display)',
          color: 'var(--text-heading)',
          marginBottom: 'var(--space-8)',
        }}
      >
        Minhas Tarefas
      </h1>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <TaskForm />
      </div>
      <TaskList />
    </main>
  );
}
