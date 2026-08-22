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

export const SingleSelect: Story = {
  render: function Render() {
    const [selected, setSelected] = useState('Bem');
    const options = ['Ótimo', 'Bem', 'Estável', 'Difícil'];
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => (
          <Chip key={o} selected={selected === o} onPress={() => setSelected(o)}>
            {o}
          </Chip>
        ))}
      </View>
    );
  },
};

export const Disabled: Story = {
  args: { children: 'Indisponível', disabled: true },
};
