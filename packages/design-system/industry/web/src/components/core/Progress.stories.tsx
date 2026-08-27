import type { Meta, StoryObj } from '@storybook/react';
import { Progress, Spinner } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Core/Progress',
  component: Progress,
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Progress value={62} label="Enviando" />
    </div>
  ),
};

export const NoValue: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Progress value={40} showValue={false} label="Processando" />
    </div>
  ),
};

export const SpinnerStory: StoryObj<typeof Spinner> = {
  name: 'Spinner',
  render: () => <Spinner />,
};
