import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Button } from '../core/Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Data/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: 'FilePlus',
    title: 'Nenhum formulário publicado',
    body: 'Comece de um modelo ou de uma folha em branco.',
    action: (
      <Button icon="Plus" size="sm">
        Novo formulário
      </Button>
    ),
  },
};
