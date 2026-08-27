import { Input } from '@vuotto/web';
import type { Task } from '@/redux/taskSlice';

interface EditableTaskTitleProps {
  task: Task;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onStartEditing: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EditableTaskTitle({
  task,
  isEditing,
  editValue,
  onEditValueChange,
  onStartEditing,
  onSubmit,
  onCancel,
}: EditableTaskTitleProps) {
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') onSubmit();
    if (e.key === 'Escape') onCancel();
  }

  function handleSpanKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onStartEditing();
    }
  }

  if (isEditing) {
    return (
      <Input
        type="text"
        size="sm"
        value={editValue}
        onChange={(e) => onEditValueChange(e.target.value)}
        onBlur={onSubmit}
        onKeyDown={handleInputKeyDown}
        autoFocus
        aria-label={`Editar: ${task.title}`}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <span
      style={{
        flex: 1,
        font: 'var(--weight-regular) var(--text-md)/1.4 var(--font-sans)',
        color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
        textDecoration: task.completed ? 'line-through' : 'none',
        cursor: task.completed ? 'default' : 'pointer',
      }}
      role={task.completed ? undefined : 'button'}
      tabIndex={task.completed ? undefined : 0}
      onDoubleClick={() => !task.completed && onStartEditing()}
      onKeyDown={task.completed ? undefined : handleSpanKeyDown}
      aria-label={task.completed ? task.title : `${task.title} — pressione Enter para editar`}
    >
      {task.title}
    </span>
  );
}
