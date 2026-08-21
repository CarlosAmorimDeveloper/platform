import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Buscar formulários', icon: 'Search' },
};

export const Mono: Story = {
  args: { mono: true, suffix: 'ms', defaultValue: '240' },
};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: 'valor inválido' },
};

export const SecureToggle: Story = {
  args: {
    placeholder: 'Senha',
    secureTextEntry: true,
    secureToggle: true,
    defaultValue: 'segredo123',
  },
};
