import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
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
    <View style={{ width: 320 }}>
      <Stepper steps={STEPS} current={1} />
    </View>
  ),
};

export const AllDone: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Stepper steps={STEPS} current={STEPS.length} />
    </View>
  ),
};
