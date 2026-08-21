import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { rows: 5, counter: '84/280', placeholder: 'Observações da inspeção' },
};
