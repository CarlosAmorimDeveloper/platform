import { View } from 'react-native';
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
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge tone="neutral">Rascunho</Badge>
      <Badge tone="success" dot>
        Publicado
      </Badge>
      <Badge tone="warning">Pendente</Badge>
      <Badge tone="danger">Erro</Badge>
      <Badge tone="info">Info</Badge>
    </View>
  ),
};
