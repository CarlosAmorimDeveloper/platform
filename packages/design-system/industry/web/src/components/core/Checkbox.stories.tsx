import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox label="Aceito os termos" defaultChecked />
      <Checkbox label="Receber novidades por email" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label="Lembrar minha escolha"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    }
    return <ControlledCheckbox />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox label="Desabilitado, desmarcado" disabled />
      <Checkbox label="Desabilitado, marcado" disabled defaultChecked />
    </div>
  ),
};
