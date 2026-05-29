import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    title: { control: 'text' },
    onDismiss: { action: 'onDismiss' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DialogInterativo() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onPress={() => setVisible(true)}>Abrir Dialog</Button>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        title="Confirmar ação"
        actions={[
          <Button key="cancel" variant="ghost" size="sm" onPress={() => setVisible(false)}>
            Cancelar
          </Button>,
          <Button key="confirm" size="sm" onPress={() => setVisible(false)}>
            Confirmar
          </Button>,
        ]}
      >
        <Text>Tem certeza que deseja continuar?</Text>
      </Dialog>
    </>
  );
}

export const Interativo: Story = {
  render: () => <DialogInterativo />,
};

export const Aberto: Story = {
  args: {
    visible: true,
    title: 'Deletar item',
    children: <Text>Esta ação não pode ser desfeita.</Text>,
    actions: (
      <Button size="sm" variant="danger">
        Deletar
      </Button>
    ),
  },
};
