import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Data/ProgressBar',
  component: ProgressBar,
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'cool', 'success', 'warning', 'danger'] },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { label: 'Taxa de conclusão', value: 98.2, showValue: true, tone: 'success' },
};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 14, width: 280 }}>
      <ProgressBar label="Taxa de conclusão" value={98.2} showValue tone="success" />
      <ProgressBar label="Sincronização" value={42} showValue tone="cool" />
      <ProgressBar label="Fila offline" value={12} max={50} showValue tone="warning" />
    </View>
  ),
};
