import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ChipGrupo() {
  const [selected, setSelected] = useState('todos');
  const options = ['todos', 'abertos', 'fechados'];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {options.map((option) => (
        <Chip key={option} selected={selected === option} onPress={() => setSelected(option)}>
          {option}
        </Chip>
      ))}
    </View>
  );
}

export const Grupo: Story = {
  render: () => <ChipGrupo />,
};

export const Selecionado: Story = {
  args: { selected: true, children: 'Selecionado' },
};

export const NaoSelecionado: Story = {
  args: { selected: false, children: 'Não selecionado' },
};

export const ComIcone: Story = {
  args: { children: 'Urgente', icon: 'alert' },
};

export const Desabilitado: Story = {
  args: { children: 'Indisponível', disabled: true },
};
