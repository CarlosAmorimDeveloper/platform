import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from './LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'Data/LineChart',
  component: LineChart,
};

export default meta;
type Story = StoryObj<typeof LineChart>;

const series = [
  { key: 'respostas', label: 'Respostas' },
  { key: 'meta', label: 'Meta' },
];

const data = [
  { x: 'Seg', respostas: 820, meta: 900 },
  { x: 'Ter', respostas: 932, meta: 900 },
  { x: 'Qua', respostas: 901, meta: 900 },
  { x: 'Qui', respostas: 1034, meta: 900 },
  { x: 'Sex', respostas: 1284, meta: 900 },
];

export const Default: Story = {
  args: { data, series },
};

export const FourSeries: Story = {
  args: {
    data: [
      { x: 'Jan', a: 40, b: 30, c: 20, d: 10 },
      { x: 'Fev', a: 55, b: 42, c: 18, d: 24 },
      { x: 'Mar', a: 48, b: 38, c: 30, d: 20 },
    ],
    series: [
      { key: 'a', label: 'Série A' },
      { key: 'b', label: 'Série B' },
      { key: 'c', label: 'Série C' },
      { key: 'd', label: 'Série D' },
    ],
  },
};
