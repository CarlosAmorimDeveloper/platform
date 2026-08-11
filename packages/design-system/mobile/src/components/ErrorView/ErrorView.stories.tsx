import type { Meta, StoryObj } from '@storybook/react';
import { ErrorView } from './ErrorView';

const meta: Meta<typeof ErrorView> = {
  title: 'Components/ErrorView',
  component: ErrorView,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
    icon: { control: 'text' },
    retryLabel: { control: 'text' },
    onRetry: { action: 'onRetry' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Não foi possível carregar os dados. Tente novamente.',
  },
};

export const ComTitulo: Story = {
  args: {
    title: 'Algo deu errado',
    message: 'Não foi possível se conectar ao servidor.',
  },
};

export const ComRetry: Story = {
  args: {
    title: 'Algo deu errado',
    message: 'Não foi possível se conectar ao servidor.',
    onRetry: () => {},
  },
};
