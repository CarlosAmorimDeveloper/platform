import type { Meta, StoryObj } from '@storybook/react';
import { color } from '@industry/tokens';
import { Duotone } from './Duotone';

const meta: Meta<typeof Duotone> = {
  title: 'Core/Duotone',
  component: Duotone,
};

export default meta;
type Story = StoryObj<typeof Duotone>;

export const OverColor: Story = {
  render: () => <Duotone style={{ width: 320, height: 220, backgroundColor: color.surface }} />,
};
