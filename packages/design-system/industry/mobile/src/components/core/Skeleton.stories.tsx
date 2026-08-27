import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Core/Skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Block: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Skeleton height={120} />
    </View>
  ),
};

export const Lines: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Skeleton lines={3} />
    </View>
  ),
};
