import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { viz } from '@industry/tokens';
import { PieChart } from './PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Core/PieChart',
  component: PieChart,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <PieChart
        slices={[
          { label: 'Aberto', value: 8, color: viz['1'] },
          { label: 'Em Progresso', value: 3, color: viz['4'] },
          { label: 'Concluído', value: 14, color: viz['3'] },
        ]}
      />
    </View>
  ),
};

export const Empty: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <PieChart slices={[{ label: 'Sem dados', value: 0, color: viz['1'] }]} />
    </View>
  ),
};
