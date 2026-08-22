import type { Meta, StoryObj } from '@storybook/react';
import { ErrorView } from './ErrorView';

const meta: Meta<typeof ErrorView> = {
  title: 'Data/ErrorView',
  component: ErrorView,
};

export default meta;
type Story = StoryObj<typeof ErrorView>;

export const Default: Story = {
  args: { description: 'Não foi possível carregar seus dados.' },
};

export const WithRetry: Story = {
  args: {
    title: 'Algo deu errado',
    description: 'Verifique sua conexão e tente novamente.',
    onAction: () => {},
  },
};
