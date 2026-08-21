import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'info'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="neutral">Rascunho</Badge>
      <Badge tone="success" dot>
        Publicado
      </Badge>
      <Badge tone="warning">Pendente</Badge>
      <Badge tone="danger">Erro</Badge>
      <Badge tone="info">Info</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { tone: 'success', icon: 'check', children: 'Verificado' },
};
