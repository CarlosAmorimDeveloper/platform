import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Core/DatePicker',
  component: DatePicker,
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<Date | null>(null);
      return (
        <div style={{ width: 260 }}>
          <DatePicker label="Data de nascimento" value={value ?? undefined} onChange={setValue} />
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithRange: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState<Date | null>(new Date());
      return (
        <div style={{ width: 260 }}>
          <DatePicker
            label="Data do agendamento"
            hint="Apenas os próximos 30 dias"
            value={value ?? undefined}
            onChange={setValue}
            min={new Date()}
            max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <DatePicker label="Data" error="Selecione uma data válida" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 260 }}>
      <DatePicker label="Data" value={new Date()} disabled />
    </div>
  ),
};
