import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../components/core';

const meta: Meta = {
  title: 'Foundations/Icons',
};

export default meta;
type Story = StoryObj;

const NAMES = [
  'sparkle',
  'layers',
  'circle',
  'arrow-right',
  'search',
  'settings',
  'user',
  'heart',
  'bell',
  'calendar',
  'image',
  'folder',
];

export const LucideSet: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
        gap: 'var(--space-2)',
      }}
    >
      {NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            padding: 'var(--space-2) 0',
            color: 'var(--color-text)',
          }}
        >
          <Icon name={name} size="md" />
          <i style={{ fontStyle: 'normal', fontSize: 10, opacity: 0.55 }}>{name}</i>
        </div>
      ))}
    </div>
  ),
};

export const Usage: Story = {
  render: () => (
    <p style={{ fontSize: 12, opacity: 0.6, maxWidth: '60ch', color: 'var(--color-text)' }}>
      Use Lucide (https://lucide.dev) em <code>stroke-width</code> 1.5 para uma leitura mais fina e
      técnica em todo o sistema — nunca traço grosso.
    </p>
  ),
};
