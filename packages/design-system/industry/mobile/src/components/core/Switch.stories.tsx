import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Uncontrolled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Switch label="Notificações" defaultChecked />
      <Switch label="Modo escuro" />
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch label="Sincronização automática" checked={checked} onCheckedChange={setChecked} />
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Switch label="Desabilitado, desligado" disabled />
      <Switch label="Desabilitado, ligado" disabled defaultChecked />
    </View>
  ),
};
