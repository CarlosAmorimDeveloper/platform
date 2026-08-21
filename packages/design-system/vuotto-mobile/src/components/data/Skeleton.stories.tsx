import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Data/Skeleton',
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Lines: Story = {
  args: { lines: 3 },
};

export const Block: Story = {
  args: { width: 120, height: 32, radius: 10 },
};
