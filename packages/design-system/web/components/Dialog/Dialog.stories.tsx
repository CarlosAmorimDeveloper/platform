import type { Meta, StoryObj } from '@storybook/react';
import type React from 'react';
import { useState } from 'react';
import { Button } from '@mui/material';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    destructive: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DialogWithState(args: Partial<React.ComponentProps<typeof Dialog>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outlined"
        color={args.destructive ? 'error' : 'primary'}
        onClick={() => setOpen(true)}
      >
        {args.destructive ? 'Deletar item' : 'Abrir dialog'}
      </Button>
      <Dialog
        title={args.title ?? ''}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        confirmLabel={args.confirmLabel}
        cancelLabel={args.cancelLabel}
        destructive={args.destructive}
        sx={args.sx}
      >
        {args.children}
      </Dialog>
    </>
  );
}

export const Default: Story = {
  render: (args) => <DialogWithState {...args} />,
  args: {
    title: 'Confirmar ação',
    children: 'Tem certeza que deseja continuar? Esta ação não pode ser desfeita.',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
  },
};

export const Destructive: Story = {
  render: (args) => <DialogWithState {...args} />,
  args: {
    title: 'Deletar item',
    children: 'Esta ação é permanente. O item será removido e não poderá ser recuperado.',
    confirmLabel: 'Deletar',
    cancelLabel: 'Cancelar',
    destructive: true,
  },
};
