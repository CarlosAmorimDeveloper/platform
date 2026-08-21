import { View } from 'react-native';
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
    name: 'ArrowRight',
    size: 'sm',
    color: '#e6e6e6',
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Icon name="WifiOff" size="xs" color="#e6e6e6" />
      <Icon name="WifiOff" size="sm" color="#e6e6e6" />
      <Icon name="WifiOff" size="md" color="#e6e6e6" />
      <Icon name="WifiOff" size="lg" color="#e6e6e6" />
    </View>
  ),
};

export const AsAction: Story = {
  args: {
    name: 'X',
    color: '#e6e6e6',
    accessibilityLabel: 'Fechar',
  },
};
