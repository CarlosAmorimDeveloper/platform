import type { Meta, StoryObj } from '@storybook/react';
import { FileDrop } from './FileDrop';

const meta: Meta<typeof FileDrop> = {
  title: 'Forms/FileDrop',
  component: FileDrop,
};

export default meta;
type Story = StoryObj<typeof FileDrop>;

export const Default: Story = {
  args: {
    icon: 'camera',
    label: 'Anexar foto da inspeção',
    hint: 'JPG até 10 MB',
    accept: 'image/jpeg',
  },
};
