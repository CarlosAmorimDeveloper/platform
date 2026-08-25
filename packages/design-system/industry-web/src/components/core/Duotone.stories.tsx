import type { Meta, StoryObj } from '@storybook/react';
import { Duotone } from './Duotone';

const meta: Meta<typeof Duotone> = {
  title: 'Core/Duotone',
  component: Duotone,
};

export default meta;
type Story = StoryObj<typeof Duotone>;

export const OverColor: Story = {
  render: () => <Duotone style={{ width: 320, height: 220, background: 'var(--color-surface)' }} />,
};

export const WithImage: Story = {
  render: () => (
    <Duotone style={{ width: 320 }}>
      <img src="https://picsum.photos/320/220" alt="" style={{ display: 'block', width: '100%' }} />
    </Duotone>
  ),
};
