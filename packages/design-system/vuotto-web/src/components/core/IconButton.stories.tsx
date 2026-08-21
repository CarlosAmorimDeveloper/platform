import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Core/IconButton',
  component: IconButton,
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'solid', 'pill'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton icon="settings" label="Configurações" variant="ghost" />
      <IconButton icon="eye" label="Pré-visualizar" variant="solid" />
      <IconButton icon="plus" label="Adicionar" variant="pill" />
    </div>
  ),
};

export const Active: Story = {
  args: { icon: 'eye', label: 'Pré-visualizar', active: true },
};

export const TouchSize: Story = {
  args: { icon: 'settings', label: 'Configurações', size: 'lg' },
};
