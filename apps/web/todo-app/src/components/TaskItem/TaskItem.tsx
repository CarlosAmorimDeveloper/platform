'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTask, editTask, removeTask } from '@/redux/taskSlice';
import type { Task } from '@/redux/taskSlice';
import type { AppDispatch } from '@/redux/store';
import { isValidTaskTitle, sanitizeTaskTitle } from '@/domain/task';
import { Button, Card, Checkbox } from '@vuotto/web';
import { EditableTaskTitle } from './EditableTaskTitle';

interface TaskItemProps {
  task: Task;
}

// The checkbox's label is required by `Checkbox`, but the task title is
// already shown as its own element next to it — visually hide the label
// text instead of duplicating it, while keeping it in the accessibility tree.
const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  useEffect(() => {
    if (!isEditing) setEditValue(task.title);
  }, [task.title, isEditing]);

  function handleToggle() {
    dispatch(toggleTask(task.id));
  }

  function handleRemove() {
    dispatch(removeTask(task.id));
  }

  function handleEditSubmit() {
    const trimmed = sanitizeTaskTitle(editValue);
    if (isValidTaskTitle(editValue) && trimmed !== task.title) {
      dispatch(editTask({ id: task.id, title: trimmed }));
    } else {
      setEditValue(task.title);
    }
    setIsEditing(false);
  }

  function handleEditCancel() {
    setEditValue(task.title);
    setIsEditing(false);
  }

  return (
    <li style={{ listStyle: 'none' }}>
      <Card padding="sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Checkbox
          label={
            <span style={srOnlyStyle}>
              {`Marcar "${task.title}" como ${task.completed ? 'incompleta' : 'completa'}`}
            </span>
          }
          checked={task.completed}
          onChange={handleToggle}
        />

        <EditableTaskTitle
          task={task}
          isEditing={isEditing}
          editValue={editValue}
          onEditValueChange={setEditValue}
          onStartEditing={() => setIsEditing(true)}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          {!task.completed && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="Editar tarefa"
            >
              Editar
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={handleRemove} aria-label="Remover tarefa">
            Remover
          </Button>
        </div>
      </Card>
    </li>
  );
}
