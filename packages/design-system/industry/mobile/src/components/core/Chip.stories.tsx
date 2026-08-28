import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Core/Chip',
  component: Chip,
};

export default meta;
type Story = StoryObj<typeof Chip>;

const OPTIONS = ['Ótimo', 'Bem', 'Neutro', 'Difícil', 'Muito difícil'];

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Chip>Ótimo</Chip>
      <Chip selected>Bem</Chip>
      <Chip disabled>Neutro</Chip>
    </View>
  ),
};

export const SingleSelect: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('Bem');
    return (
      <View style={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {OPTIONS.map((option) => (
          <Chip key={option} selected={selected === option} onPress={() => setSelected(option)}>
            {option}
          </Chip>
        ))}
      </View>
    );
  },
};
