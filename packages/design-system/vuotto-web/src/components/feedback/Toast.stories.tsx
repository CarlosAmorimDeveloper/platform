import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../core/Button';

const meta: Meta = {
  title: 'Feedback/Toast',
};

export default meta;
type Story = StoryObj;

function Demo() {
  const { show } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={() =>
          show({
            tone: 'success',
            title: 'Formulário publicado',
            description: 'v2.4.0 · 12 campos',
          })
        }
      >
        Sucesso
      </Button>
      <Button
        onClick={() =>
          show({ tone: 'danger', title: 'Falha ao publicar', description: 'Verifique a conexão' })
        }
      >
        Erro
      </Button>
      <Button onClick={() => show({ title: 'Sincronizando…' })}>Neutro</Button>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
