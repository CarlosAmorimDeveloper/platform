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
      { value: 'forms', label: 'Formulários', icon: 'list-checks', count: 12 },
      { value: 'inbox', label: 'Caixa de entrada', icon: 'inbox', count: 3 },
    ],
  },
  {
    label: 'Sistema',
    items: [{ value: 'settings', label: 'Configurações', icon: 'settings' }],
  },
];

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('forms');
    return (
      <SideNav value={value} onChange={setValue} header={<Lockup size="sm" />} groups={groups} />
    );
  },
};

export const Collapsed: Story = {
  render: function Render() {
    const [value, setValue] = useState('forms');
    return (
      <SideNav
        collapsed
        value={value}
        onChange={setValue}
        header={<Lockup size="sm" />}
        groups={groups}
      />
    );
  },
};

export const Drawer: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    const [value, setValue] = useState('forms');
    const [open, setOpen] = useState(true);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Abrir menu</Button>
        <SideNav
          value={value}
          onChange={setValue}
          header={<Lockup size="sm" />}
          groups={groups}
          open={open}
          onOpenChange={setOpen}
        />
      </div>
    );
  },
};
