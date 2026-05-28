import type { Meta, StoryObj } from '@storybook/react';
import { FAB } from './FAB';

const meta: Meta<typeof FAB> = {
  title: 'Components/FAB',
  component: FAB,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'plus',
    accessibilityLabel: 'Adicionar',
  },
};
