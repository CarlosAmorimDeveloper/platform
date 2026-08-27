import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Core/Toast',
  component: Toast,
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 340 }}>
      <Toast title="Alterações salvas" onDismiss={() => {}}>
        Suas alterações foram salvas com sucesso.
      </Toast>
    </div>
  ),
};

export const Danger: Story = {
  render: () => (
    <div style={{ width: 340 }}>
      <Toast tone="danger" title="Falha ao salvar" onDismiss={() => {}}>
        Verifique sua conexão e tente novamente.
      </Toast>
    </div>
  ),
};
