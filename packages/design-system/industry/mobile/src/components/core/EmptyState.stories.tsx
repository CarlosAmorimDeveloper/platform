import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Core/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      title="Nenhum projeto ainda"
      body="Crie o primeiro projeto para começar a organizar seu trabalho."
      action={<Button variant="primary">Criar projeto</Button>}
    />
  ),
};
