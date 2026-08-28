import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Core/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const ITEMS = [
  { key: 'a', title: 'O que é o Industry?', content: 'A segunda geração do design system.' },
  { key: 'b', title: 'Como reportar um bug?', content: 'Abra uma issue no board REB.' },
  { key: 'c', title: 'Em manutenção', content: 'Indisponível no momento.', disabled: true },
];

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Accordion items={ITEMS} defaultOpenKeys={['a']} />
    </View>
  ),
};

export const Multiple: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Accordion items={ITEMS} multiple defaultOpenKeys={['a', 'b']} />
    </View>
  ),
};
