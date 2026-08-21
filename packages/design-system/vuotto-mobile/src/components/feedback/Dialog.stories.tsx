import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../core/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Feedback/Dialog',
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Publicar formulário</Button>
        <Dialog
          open={open}
          title="Publicar formulário?"
          description="A versão v2.4.0 fica disponível para o time de campo."
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button variant="ghost" onPress={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onPress={() => setOpen(false)}>Publicar</Button>
            </>
          }
        />
      </>
    );
  },
};
