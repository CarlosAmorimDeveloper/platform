import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Core/Toast',
  component: Toast,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <Toast title="Alterações salvas" onDismiss={() => {}}>
      Suas alterações foram salvas com sucesso.
    </Toast>
  ),
};

export const Danger: Story = {
  render: () => (
    <Toast tone="danger" title="Falha ao salvar" onDismiss={() => {}}>
      Verifique sua conexão e tente novamente.
    </Toast>
  ),
};
