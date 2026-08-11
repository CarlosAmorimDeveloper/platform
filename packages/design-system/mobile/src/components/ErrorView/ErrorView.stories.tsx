import type { Meta, StoryObj } from '@storybook/react';
import { ErrorView } from './ErrorView';

const meta: Meta<typeof ErrorView> = {
  title: 'Components/ErrorView',
  component: ErrorView,
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
    description: 'Não foi possível carregar os dados. Tente novamente.',
  },
};

export const ComTitulo: Story = {
  args: {
    title: 'Algo deu errado',
    description: 'Não foi possível se conectar ao servidor.',
  },
};

export const ComAcao: Story = {
  args: {
    title: 'Algo deu errado',
    description: 'Não foi possível se conectar ao servidor.',
    onAction: () => {},
  },
};

export const SemIcone: Story = {
  args: {
    title: 'Algo deu errado',
    description: 'Não foi possível se conectar ao servidor.',
    icon: '',
    onAction: () => {},
  },
};
