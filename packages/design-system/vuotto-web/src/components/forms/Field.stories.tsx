import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input } from './Input';

const meta: Meta<typeof Field> = {
  title: 'Forms/Field',
  component: Field,
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Field label="Nome do formulário" hint="Aparece no topo da resposta" required>
        <Input placeholder="Inspeção de campo" />
      </Field>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Field label="E-mail" error="Endereço inválido">
        <Input invalid defaultValue="não-é-email" />
      </Field>
    </div>
  ),
};
