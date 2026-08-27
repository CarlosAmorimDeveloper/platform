import { useState } from 'react';
import { View } from 'react-native';
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
        <View style={{ padding: 16 }}>
          <DatePicker label="Data de nascimento" value={value} onChange={setValue} />
        </View>
      );
    }
    return <Demo />;
  },
};

export const WithError: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <DatePicker label="Data" error="Selecione uma data válida" />
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <DatePicker label="Data" value={new Date()} disabled />
    </View>
  ),
};
