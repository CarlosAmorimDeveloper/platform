import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'arrow-right',
    size: 'sm',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="wifi-off" size="xs" />
      <Icon name="wifi-off" size="sm" />
      <Icon name="wifi-off" size="md" />
      <Icon name="wifi-off" size="lg" />
    </div>
  ),
};

export const Decorative: Story = {
  args: {
    name: 'list-checks',
    color: 'var(--text-tertiary)',
  },
};

export const AsAction: Story = {
  args: {
    name: 'x',
    'aria-label': 'Fechar',
  },
};
