import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Stat } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'Data/Stat',
  component: Stat,
  argTypes: {
    trend: { control: 'select', options: ['up', 'down', 'flat'] },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    label: 'Respostas (30d)',
    value: 1284,
    delta: '+12,4%',
    trend: 'up',
    footnote: 'atualizado há 4 min',
  },
};

export const Row: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32 }}>
      <Stat
        label="Respostas (30d)"
        value={1284}
        delta="+12,4%"
        trend="up"
        footnote="atualizado há 4 min"
      />
      <Stat label="Conclusão" value="98,2" unit="%" delta="-0,6%" trend="down" />
      <Stat label="Fila offline" value={12} unit="itens" />
    </View>
  ),
};
