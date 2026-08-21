import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Buscar formulários', icon: 'search' },
};

export const Mono: Story = {
  args: { mono: true, suffix: 'ms', defaultValue: '240' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'valor inválido' },
};

export const TouchSize: Story = {
  args: { size: 'lg', placeholder: '48px de altura' },
};
