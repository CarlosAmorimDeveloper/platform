import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function RadioGrupo() {
  const [selected, setSelected] = useState('a');
  return (
    <>
      <Radio selected={selected === 'a'} onPress={() => setSelected('a')} label="Opção A" />
      <Radio selected={selected === 'b'} onPress={() => setSelected('b')} label="Opção B" />
      <Radio
        selected={selected === 'c'}
        onPress={() => setSelected('c')}
        label="Opção C"
        disabled
      />
    </>
  );
}

export const Grupo: Story = {
  render: () => <RadioGrupo />,
};

export const Selecionado: Story = {
  args: { selected: true, label: 'Selecionado' },
};

export const NaoSelecionado: Story = {
  args: { selected: false, label: 'Não selecionado' },
};

export const Desabilitado: Story = {
  args: { selected: false, label: 'Indisponível', disabled: true },
};
