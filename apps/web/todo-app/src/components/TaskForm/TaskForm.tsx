'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '@/redux/taskSlice';
import type { AppDispatch } from '@/redux/store';
import Stack from '@mui/material/Stack';
import { Button } from '@ds/web/components/Button';
import { Input } from '@ds/web/components/Input';

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
    <Stack
      component="form"
      direction="row"
      spacing={1}
      onSubmit={handleSubmit}
      aria-label="Task form"
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nova tarefa…"
        aria-label="Título da nova tarefa"
        className="flex-1"
      />
      <Button type="submit" disabled={!value.trim()}>
        Adicionar
      </Button>
    </Stack>
  );
}
