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
