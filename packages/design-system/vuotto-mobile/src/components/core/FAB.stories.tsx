import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { FAB } from './FAB';

const meta: Meta<typeof FAB> = {
  title: 'Core/FAB',
  component: FAB,
  argTypes: {
    size: { control: 'select', options: ['md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

export const Default: Story = {
  args: { label: 'Adicionar' },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <FAB label="Adicionar" size="md" />
      <FAB label="Adicionar" size="lg" />
    </View>
  ),
};

export const CustomIcon: Story = {
  args: { icon: 'MessageSquare', label: 'Nova mensagem' },
};
