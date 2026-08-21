import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Permitir envio offline',
    description: 'Respostas ficam no dispositivo até sincronizar',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: { label: 'Selecionar todos', indeterminate: true },
};
