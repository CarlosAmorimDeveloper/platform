import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { Button } from './Button';

const meta: Meta<typeof Menu> = {
  title: 'Core/Menu',
  component: Menu,
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu
      trigger={<Button>Ações</Button>}
      items={[
        { label: 'Editar', onSelect: () => {} },
        { label: 'Duplicar', onSelect: () => {} },
        { label: 'Excluir', onSelect: () => {}, disabled: true },
      ]}
    />
  ),
};
