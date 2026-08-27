import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Core/Select',
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

const OPTIONS = ['Rascunho', 'Em revisão', 'Publicado'];

export const Default: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Select label="Status" options={OPTIONS} value="Rascunho" />
    </View>
  ),
};

export const WithHint: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Select label="Status" hint="Visível para toda a equipe" options={OPTIONS} />
    </View>
  ),
};

export const WithError: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Select label="Status" error="Selecione um status" options={OPTIONS} />
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Select label="Status" disabled options={OPTIONS} value="Rascunho" />
    </View>
  ),
};
