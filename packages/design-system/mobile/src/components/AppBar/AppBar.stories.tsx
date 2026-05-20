import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './AppBar';

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    onBackPress: { action: 'onBackPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Título da Página' },
};

export const ComBotaoVoltar: Story = {
  args: { title: 'Detalhes', onBackPress: () => {} },
};

export const ComAcoes: Story = {
  args: {
    title: 'Lista',
    actions: [
      { icon: 'magnify', onPress: () => {}, accessibilityLabel: 'Buscar' },
      { icon: 'dots-vertical', onPress: () => {}, accessibilityLabel: 'Mais opções' },
    ],
  },
};

export const Completo: Story = {
  args: {
    title: 'Meu App',
    onBackPress: () => {},
    actions: [{ icon: 'magnify', onPress: () => {}, accessibilityLabel: 'Buscar' }],
  },
};
