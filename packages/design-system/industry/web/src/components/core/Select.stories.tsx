import type { Meta, StoryObj } from '@storybook/react';
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
    <div style={{ width: 280 }}>
      <Select label="Status" options={OPTIONS} defaultValue="Rascunho" />
    </div>
  ),
};

export const WithHint: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select label="Status" hint="Visível para toda a equipe" options={OPTIONS} />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select label="Status" error="Selecione um status" options={OPTIONS} />
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select label="Status" size="sm" options={OPTIONS} defaultValue="Rascunho" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <Select label="Status" disabled options={OPTIONS} defaultValue="Rascunho" />
    </div>
  ),
};
