import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SideNav } from './SideNav';
import { Lockup } from '../core/Lockup';
import { Button } from '../core/Button';

const meta: Meta<typeof SideNav> = {
  title: 'Navigation/SideNav',
  component: SideNav,
};

export default meta;
type Story = StoryObj<typeof SideNav>;

const groups = [
  {
    label: 'Trabalho',
    items: [
      { value: 'forms', label: 'Formulários', icon: 'ListChecks' as const, count: 12 },
      { value: 'inbox', label: 'Caixa de entrada', icon: 'Inbox' as const, count: 3 },
    ],
  },
  {
    label: 'Sistema',
    items: [{ value: 'settings', label: 'Configurações', icon: 'Settings' as const }],
  },
];

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('forms');
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Abrir menu</Button>
        <SideNav
          value={value}
          onChange={setValue}
          header={<Lockup size="sm" />}
          groups={groups}
          open={open}
          onOpenChange={setOpen}
        />
      </>
    );
  },
};
