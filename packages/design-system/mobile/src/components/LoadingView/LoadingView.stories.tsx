import type { Meta, StoryObj } from '@storybook/react';
import { LoadingView } from './LoadingView';

const meta: Meta<typeof LoadingView> = {
  title: 'Components/LoadingView',
  component: LoadingView,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { visible: true },
};

export const ComMensagem: Story = {
  args: { visible: true, message: 'Carregando tickets...' },
};

export const Oculto: Story = {
  args: { visible: false },
};
