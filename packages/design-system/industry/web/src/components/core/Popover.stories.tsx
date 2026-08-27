import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from './Button';

const meta: Meta<typeof Popover> = {
  title: 'Core/Popover',
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Popover trigger={<Button>Abrir</Button>}>
        <p style={{ margin: 0, fontSize: 14 }}>Conteúdo do popover.</p>
      </Popover>
    </div>
  ),
};
