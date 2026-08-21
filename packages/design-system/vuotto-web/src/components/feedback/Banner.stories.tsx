import type { Meta, StoryObj } from '@storybook/react';
import { Banner } from './Banner';

const meta: Meta<typeof Banner> = {
  title: 'Feedback/Banner',
  component: Banner,
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'danger'] },
  },
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    tone: 'warning',
    title: 'Sincronização pendente',
    children: '12 respostas aguardam conexão. Sobem sozinhas quando houver rede.',
  },
};

export const Dismissible: Story = {
  args: {
    tone: 'danger',
    title: 'Falha ao publicar',
    children: 'Verifique sua conexão e tente novamente.',
    onDismiss: () => {},
  },
};
