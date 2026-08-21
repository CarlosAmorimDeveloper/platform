import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Core/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card padding="lg" radius="lg" style={{ width: 320 }}>
      Conteúdo do card
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card padding="lg" elevated style={{ width: 320 }}>
      Card elevado (--shadow-md)
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card padding="lg" interactive style={{ width: 320 }}>
      Passe o mouse — hover levanta a superfície
    </Card>
  ),
};

export const Selected: Story = {
  render: () => (
    <Card padding="lg" selected style={{ width: 320 }}>
      Card selecionado
    </Card>
  ),
};

export const Glow: Story = {
  render: () => (
    <div style={{ background: 'var(--bg-canvas)', padding: 40 }}>
      <Card padding="lg" radius="lg" glow="cool" style={{ width: 320 }}>
        Glow atmosférico — só em cards hero-level
      </Card>
    </div>
  ),
};
