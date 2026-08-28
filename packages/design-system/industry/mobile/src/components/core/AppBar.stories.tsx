import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './AppBar';

const meta: Meta<typeof AppBar> = {
  title: 'Core/AppBar',
  component: AppBar,
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  render: () => <AppBar title="Painel" />,
};

export const WithBackButton: Story = {
  render: () => <AppBar title="Detalhes do Chamado" onBackPress={() => {}} />,
};

export const WithActions: Story = {
  render: () => (
    <AppBar
      title="Painel"
      actions={[
        { icon: 'Bell', label: 'Notificações', onPress: () => {} },
        { icon: 'Settings', label: 'Configurações', onPress: () => {} },
      ]}
    />
  ),
};
