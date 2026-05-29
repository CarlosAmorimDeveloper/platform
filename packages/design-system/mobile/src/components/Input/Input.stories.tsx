import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
    multiline: { control: 'boolean' },
    numberOfLines: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function InputControlado(
  props: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChangeText'>,
) {
  const [value, setValue] = useState('');
  return <Input {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'E-mail', placeholder: 'seu@email.com' },
};

export const ComErro: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Senha', error: 'Senha muito curta' },
};

export const Desabilitado: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Campo bloqueado', disabled: true },
};

export const Senha: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Senha', secureTextEntry: true },
};

export const Multiline: Story = {
  render: (args) => <InputControlado {...args} />,
  args: {
    label: 'Descrição',
    placeholder: 'Descreva o problema...',
    multiline: true,
    numberOfLines: 4,
  },
};
