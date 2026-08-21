import type { Meta, StoryObj } from '@storybook/react';
import { vtColors } from '@vuotto/tokens';
import { PieChart } from './PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Data/PieChart',
  component: PieChart,
};

export default meta;
type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
  args: {
    slices: [
      { label: 'Aberto', value: 12, color: vtColors.cool },
      { label: 'Em andamento', value: 8, color: vtColors.warning },
      { label: 'Fechado', value: 24, color: vtColors.success },
      { label: 'Cancelado', value: 3, color: vtColors.danger },
    ],
  },
};

export const Empty: Story = {
  args: {
    slices: [
      { label: 'Aberto', value: 0, color: vtColors.cool },
      { label: 'Fechado', value: 0, color: vtColors.success },
    ],
  },
};
