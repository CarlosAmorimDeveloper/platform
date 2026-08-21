import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './AppBar';

const meta: Meta<typeof AppBar> = {
  title: 'Navigation/AppBar',
  component: AppBar,
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  args: { title: 'Meus formulários' },
};

export const WithBack: Story = {
  args: { title: 'Detalhes do formulário', onBackPress: () => {} },
};

export const WithActions: Story = {
  args: {
    title: 'Meus formulários',
    actions: [{ icon: 'LogOut', onPress: () => {}, label: 'Sair' }],
  },
};

export const WithBackAndActions: Story = {
  args: {
    title: 'Novo formulário',
    onBackPress: () => {},
    actions: [{ icon: 'Trash2', onPress: () => {}, label: 'Excluir' }],
  },
};
