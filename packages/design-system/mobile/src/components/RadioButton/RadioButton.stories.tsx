import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
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
      <RadioButton selected={selected === 'a'} onPress={() => setSelected('a')} label="Opção A" />
      <RadioButton selected={selected === 'b'} onPress={() => setSelected('b')} label="Opção B" />
      <RadioButton
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
