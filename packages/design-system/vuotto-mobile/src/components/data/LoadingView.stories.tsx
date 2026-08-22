import type { Meta, StoryObj } from '@storybook/react';
import { LoadingView } from './LoadingView';

const meta: Meta<typeof LoadingView> = {
  title: 'Data/LoadingView',
  component: LoadingView,
};

export default meta;
type Story = StoryObj<typeof LoadingView>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: { message: 'Carregando seus formulários...' },
};
