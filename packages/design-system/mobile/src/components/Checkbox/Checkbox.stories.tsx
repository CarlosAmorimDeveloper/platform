import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { action: 'onValueChange' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Desmarcado: Story = {
  args: { checked: false, label: 'Aceito os termos de uso' },
};

export const Marcado: Story = {
  args: { checked: true, label: 'Aceito os termos de uso' },
};

export const Desabilitado: Story = {
  args: { checked: false, label: 'Opção indisponível', disabled: true },
};

export const MarcadoDesabilitado: Story = {
  args: { checked: true, label: 'Opção bloqueada', disabled: true },
};
