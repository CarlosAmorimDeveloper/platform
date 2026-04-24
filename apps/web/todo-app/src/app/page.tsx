import { TaskForm, TaskList } from "@/components";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-gray-800">My Tasks</h1>
      <div className="mb-6">
        <TaskForm />
      </div>
      <TaskList />
    </main>
  );
}
