import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const frameworkOptions = [
  { label: 'React Native', value: 'rn' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Expo', value: 'expo' },
  { label: 'Ionic', value: 'ionic' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SelectControlado(
  props: Omit<React.ComponentProps<typeof Select>, 'value' | 'onChange' | 'options'>,
) {
  const [value, setValue] = useState('');
  return <Select {...props} value={value} onChange={setValue} options={frameworkOptions} />;
}

export const Default: Story = {
  render: (args) => <SelectControlado {...args} />,
  args: { label: 'Framework', placeholder: 'Escolha um framework' },
};

export const ComValorInicial: Story = {
  render: () => {
    const [value, setValue] = useState('rn');
    return (
      <Select value={value} onChange={setValue} options={frameworkOptions} label="Framework" />
    );
  },
};

export const Desabilitado: Story = {
  render: (args) => <SelectControlado {...args} />,
  args: { label: 'Bloqueado', disabled: true },
};
