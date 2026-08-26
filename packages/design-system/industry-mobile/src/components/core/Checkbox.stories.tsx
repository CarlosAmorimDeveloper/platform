import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox label="Aceito os termos" defaultChecked />
      <Checkbox label="Receber novidades por email" />
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox label="Lembrar minha escolha" checked={checked} onCheckedChange={setChecked} />
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox label="Desabilitado, desmarcado" disabled />
      <Checkbox label="Desabilitado, marcado" disabled defaultChecked />
    </View>
  ),
};
