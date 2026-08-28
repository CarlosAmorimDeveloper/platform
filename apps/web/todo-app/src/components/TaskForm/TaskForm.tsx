'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '@/redux/taskSlice';
import type { AppDispatch } from '@/redux/store';
import { isValidTaskTitle, sanitizeTaskTitle } from '@/domain/task';
import { Button, TextField } from '@industry/web';

export function TaskForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidTaskTitle(value)) return;

    dispatch(addTask({ title: sanitizeTaskTitle(value) }));
    setValue('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Task form"
      style={{ display: 'flex', gap: 'var(--space-3)' }}
    >
      <TextField
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nova tarefa…"
        aria-label="Título da nova tarefa"
        style={{ flex: 1 }}
      />
      <Button type="submit" disabled={!isValidTaskTitle(value)}>
        Adicionar
      </Button>
    </form>
  );
}
