import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    actionLabel: { control: 'text' },
    onAction: { action: 'onAction' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Nenhum item encontrado',
    description: 'Quando você criar itens, eles vão aparecer aqui.',
  },
};

export const ComIcone: Story = {
  args: {
    title: 'Nenhum ticket aberto',
    description: 'Tudo em dia por aqui.',
    icon: 'inbox-outline',
  },
};

export const ComAcao: Story = {
  args: {
    title: 'Nenhum item encontrado',
    description: 'Adicione o primeiro item para começar.',
    icon: 'inbox-outline',
    actionLabel: 'Adicionar item',
    onAction: () => {},
  },
};
