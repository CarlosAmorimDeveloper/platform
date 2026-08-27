import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="neutral">Neutro</Badge>
      <Badge tone="accent">Destaque</Badge>
      <Badge tone="success">Sucesso</Badge>
      <Badge tone="warning">Atenção</Badge>
      <Badge tone="danger">Erro</Badge>
    </div>
  ),
};

export const Solid: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge tone="success" solid>
        Publicado
      </Badge>
      <Badge tone="danger" solid>
        Crítico
      </Badge>
    </div>
  ),
};
