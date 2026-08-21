import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Navigation/Stepper',
  component: Stepper,
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Horizontal: Story = {
  args: { current: 1, steps: ['Conta', 'Workspace', 'Primeiro formulário'] },
};

export const Vertical: Story = {
  args: {
    current: 1,
    orientation: 'vertical',
    steps: ['Conta', 'Workspace', 'Primeiro formulário'],
  },
};
