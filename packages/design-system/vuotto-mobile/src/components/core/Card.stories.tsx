import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card padding="lg" radius="lg" style={{ width: 280 }}>
      <Text>Conteúdo do card</Text>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card padding="lg" elevated style={{ width: 280 }}>
      <Text>Card elevado</Text>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card padding="lg" interactive onPress={() => {}} style={{ width: 280 }}>
      <Text>Toque — pressed levanta a superfície</Text>
    </Card>
  ),
};
