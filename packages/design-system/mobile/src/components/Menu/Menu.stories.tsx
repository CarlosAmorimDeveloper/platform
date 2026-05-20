import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { Button } from '../Button';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function MenuInterativo() {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<Button onPress={() => setVisible(true)}>Abrir Menu</Button>}
      items={[
        { label: 'Editar', onPress: () => setVisible(false) },
        { label: 'Compartilhar', onPress: () => setVisible(false) },
        { label: 'Deletar', onPress: () => setVisible(false) },
        { label: 'Arquivado (bloqueado)', onPress: () => {}, disabled: true },
      ]}
    />
  );
}

export const Interativo: Story = {
  render: () => <MenuInterativo />,
};
