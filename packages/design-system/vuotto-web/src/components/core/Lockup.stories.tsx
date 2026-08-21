import type { Meta, StoryObj } from '@storybook/react';
import { Lockup } from './Lockup';

const meta: Meta<typeof Lockup> = {
  title: 'Core/Lockup',
  component: Lockup,
};

export default meta;
type Story = StoryObj<typeof Lockup>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Lockup size="sm" />
      <Lockup size="md" />
      <Lockup size="lg" />
    </div>
  ),
};

export const Stacked: Story = {
  args: { size: 'lg', stacked: true },
};
