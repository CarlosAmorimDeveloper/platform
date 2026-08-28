import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/core';
import { ToastProvider, useToast } from './ToastProvider';

const meta: Meta = {
  title: 'Core/ToastProvider',
};

export default meta;
type Story = StoryObj;

function Demo() {
  const toast = useToast();

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Button
        variant="primary"
        onPress={() => toast.show({ tone: 'success', title: 'Usuário criado com sucesso!' })}
      >
        Mostrar sucesso
      </Button>
      <Button
        variant="danger"
        onPress={() =>
          toast.show({ tone: 'danger', title: 'Falha ao salvar', description: 'Tente novamente.' })
        }
      >
        Mostrar erro
      </Button>
    </View>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
