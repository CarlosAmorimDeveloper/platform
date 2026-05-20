import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Snackbar } from './Snackbar';
import { Button } from '../Button';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    message: { control: 'text' },
    onDismiss: { action: 'onDismiss' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SnackbarInterativo({
  message,
  action,
}: {
  message: string;
  action?: { label: string; onPress: () => void };
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ padding: 16 }}>
      <Button onPress={() => setVisible(true)}>Mostrar Snackbar</Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        message={message}
        action={action}
      />
    </View>
  );
}

export const Simples: Story = {
  render: () => <SnackbarInterativo message="Salvo com sucesso!" />,
};

export const ComAcao: Story = {
  render: () => (
    <SnackbarInterativo message="Item deletado" action={{ label: 'Desfazer', onPress: () => {} }} />
  ),
};
