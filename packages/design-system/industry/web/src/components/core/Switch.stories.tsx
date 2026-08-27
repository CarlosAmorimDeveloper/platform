import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Switch label="Notificações" defaultChecked />
      <Switch label="Modo escuro" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledSwitch() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch
          label="Sincronização automática"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    }
    return <ControlledSwitch />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Switch label="Desabilitado, desligado" disabled />
      <Switch label="Desabilitado, ligado" disabled defaultChecked />
    </div>
  ),
};
