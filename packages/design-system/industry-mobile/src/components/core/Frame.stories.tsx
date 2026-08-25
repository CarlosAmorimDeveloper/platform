import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { color } from '@industry/tokens';
import { Frame } from './Frame';

const meta: Meta<typeof Frame> = {
  title: 'Core/Frame',
  component: Frame,
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  render: () => <Frame style={{ width: 240, height: 160, backgroundColor: color.surface }} />,
};

export const WithoutMarks: Story = {
  render: () => (
    <Frame marks={false} style={{ width: 240, height: 160, backgroundColor: color.surface }} />
  ),
};

export const WithContent: Story = {
  render: () => (
    <Frame style={{ width: 240, padding: 16, backgroundColor: color.surface }}>
      <Text style={{ color: color.text }}>Framed content</Text>
    </Frame>
  ),
};
