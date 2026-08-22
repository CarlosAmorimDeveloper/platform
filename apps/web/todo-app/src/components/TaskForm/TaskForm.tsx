'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '@/redux/taskSlice';
import type { AppDispatch } from '@/redux/store';
import { Button, Input } from '@vuotto/web';

export function TaskForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;

    dispatch(addTask({ title: trimmed }));
    setValue('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Task form"
      style={{ display: 'flex', gap: 'var(--space-3)' }}
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nova tarefa…"
        aria-label="Título da nova tarefa"
        style={{ flex: 1 }}
      />
      <Button type="submit" disabled={!value.trim()}>
        Adicionar
      </Button>
    </form>
  );
}
