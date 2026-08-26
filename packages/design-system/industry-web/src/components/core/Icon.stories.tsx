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
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--color-text)' }}>
      <Icon name="settings" size="xs" />
      <Icon name="settings" size="sm" />
      <Icon name="settings" size="md" />
      <Icon name="settings" size="lg" />
    </div>
  ),
};

export const AsAction: Story = {
  args: {
    name: 'x',
    'aria-label': 'Fechar',
  },
};
