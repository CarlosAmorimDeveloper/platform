import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Core/Stepper',
  component: Stepper,
};

export default meta;
type Story = StoryObj<typeof Stepper>;

const STEPS = ['Conta', 'Endereço', 'Confirmação'];

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Stepper steps={STEPS} current={1} />
    </div>
  ),
};

export const AllDone: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Stepper steps={STEPS} current={STEPS.length} />
    </div>
  ),
};
