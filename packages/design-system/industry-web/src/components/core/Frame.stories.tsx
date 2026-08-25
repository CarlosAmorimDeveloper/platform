import type { Meta, StoryObj } from '@storybook/react';
import { Frame } from './Frame';

const meta: Meta<typeof Frame> = {
  title: 'Core/Frame',
  component: Frame,
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  render: () => <Frame style={{ width: 240, height: 160, background: 'var(--color-surface)' }} />,
};

export const WithoutMarks: Story = {
  render: () => (
    <Frame marks={false} style={{ width: 240, height: 160, background: 'var(--color-surface)' }} />
  ),
};

export const AsSection: Story = {
  render: () => (
    <Frame as="section" style={{ width: 240, padding: 'var(--space-4)' }}>
      <p style={{ margin: 0, color: 'var(--color-text)' }}>Framed content</p>
    </Frame>
  ),
};
