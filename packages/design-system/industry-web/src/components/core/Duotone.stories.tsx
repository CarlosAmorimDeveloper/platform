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
      <div
        style={{
          width: '100%',
          height: 220,
          background: 'linear-gradient(135deg, #4a6fa5 0%, #e8b04b 50%, #a53f3f 100%)',
        }}
      />
    </Duotone>
  ),
};
