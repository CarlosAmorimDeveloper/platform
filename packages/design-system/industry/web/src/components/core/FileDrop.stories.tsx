import type { Meta, StoryObj } from '@storybook/react';
import { FileDrop } from './FileDrop';

const meta: Meta<typeof FileDrop> = {
  title: 'Core/FileDrop',
  component: FileDrop,
};

export default meta;
type Story = StoryObj<typeof FileDrop>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FileDrop />
    </div>
  ),
};

export const WithConstraints: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FileDrop
        label="Envie um comprovante"
        hint="PDF até 5 MB"
        accept=".pdf"
        maxSizeBytes={5 * 1024 * 1024}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FileDrop error="Arquivo excede o tamanho máximo" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <FileDrop disabled />
    </div>
  ),
};
