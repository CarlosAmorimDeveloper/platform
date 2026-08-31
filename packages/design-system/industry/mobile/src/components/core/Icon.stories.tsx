import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { color } from '@industry/tokens';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  parameters: { svgKnownIssue: true },
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
    color: color.text,
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Icon name="Settings" size="xs" color={color.text} />
      <Icon name="Settings" size="sm" color={color.text} />
      <Icon name="Settings" size="md" color={color.text} />
      <Icon name="Settings" size="lg" color={color.text} />
    </View>
  ),
};

export const AsAction: Story = {
  args: {
    name: 'X',
    color: color.text,
    accessibilityLabel: 'Fechar',
  },
};
