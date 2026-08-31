import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { FileDrop } from './FileDrop';

const meta: Meta<typeof FileDrop> = {
  title: 'Core/FileDrop',
  component: FileDrop,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof FileDrop>;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <FileDrop />
    </View>
  ),
};

export const WithError: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <FileDrop error="Arquivo obrigatório" />
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <FileDrop disabled />
    </View>
  ),
};
