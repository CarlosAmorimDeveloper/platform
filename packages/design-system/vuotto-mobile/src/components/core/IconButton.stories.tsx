import { View } from 'react-native';
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
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <IconButton icon="Settings" label="Configurações" variant="ghost" />
      <IconButton icon="Eye" label="Pré-visualizar" variant="solid" />
      <IconButton icon="Plus" label="Adicionar" variant="pill" />
    </View>
  ),
};

export const TouchSize: Story = {
  args: { icon: 'Settings', label: 'Configurações', size: 'lg' },
};
