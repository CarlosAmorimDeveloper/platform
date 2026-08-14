import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'number' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  args: { icon: 'filter-variant' },
};

export const Desabilitado: Story = {
  args: { icon: 'filter-variant', disabled: true },
};
