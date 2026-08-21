import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Data/BarChart',
  component: BarChart,
};

export default meta;
type Story = StoryObj<typeof BarChart>;

const series = [
  { key: 'publicados', label: 'Publicados' },
  { key: 'rascunhos', label: 'Rascunhos' },
];

const data = [
  { x: 'Jan', publicados: 12, rascunhos: 4 },
  { x: 'Fev', publicados: 18, rascunhos: 6 },
  { x: 'Mar', publicados: 15, rascunhos: 3 },
  { x: 'Abr', publicados: 22, rascunhos: 5 },
];

export const Default: Story = {
  args: { data, series },
};

export const SingleSeries: Story = {
  args: { data, series: [series[0]!] },
};
