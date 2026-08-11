import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    numberOfLines: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function TextareaControlado(
  props: Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChangeText'>,
) {
  const [value, setValue] = useState('');
  return <Textarea {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: (args) => <TextareaControlado {...args} />,
  args: { label: 'Descrição', placeholder: 'Descreva o problema...' },
};

export const ComErro: Story = {
  render: (args) => <TextareaControlado {...args} />,
  args: { label: 'Comentário', error: 'Campo obrigatório' },
};

export const Desabilitado: Story = {
  render: (args) => <TextareaControlado {...args} />,
  args: { label: 'Campo bloqueado', disabled: true },
};

export const MaisLinhas: Story = {
  render: (args) => <TextareaControlado {...args} />,
  args: { label: 'Descrição detalhada', numberOfLines: 8 },
};
