import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Core/Skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Block: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Skeleton height={120} />
    </div>
  ),
};

export const Lines: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Skeleton lines={3} />
    </div>
  ),
};
