import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;
type Story = StoryObj;

const HEADINGS = [
  { tag: 'h1' as const, label: 'H1 · 46' },
  { tag: 'h2' as const, label: 'H2 · 34' },
  { tag: 'h3' as const, label: 'H3 · 26' },
  { tag: 'h4' as const, label: 'H4 · 21' },
  { tag: 'h5' as const, label: 'H5 · 17' },
  { tag: 'h6' as const, label: 'H6 · 13' },
];

export const Headings: Story = {
  render: () => (
    <div>
      {HEADINGS.map(({ tag: Tag, label }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-3)',
            margin: '4px 0',
          }}
        >
          <span
            style={{
              flex: 'none',
              width: 64,
              fontSize: 10,
              opacity: 0.45,
              color: 'var(--color-text)',
            }}
          >
            {label}
          </span>
          <Tag style={{ margin: 0 }}>Um design system em Barlow Condensed</Tag>
        </div>
      ))}
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div style={{ color: 'var(--color-text)' }}>
      <p style={{ fontSize: 17, margin: '6px 0' }}>
        Tokens de design descrevem uma aparência uma vez e deixam cada página herdar.
      </p>
      <p style={{ fontSize: 15, margin: '6px 0' }}>
        The quick brown fox jumps over the lazy dog — corpo de texto no tamanho de leitura.
      </p>
      <p className="text-muted" style={{ fontSize: 13, margin: '6px 0' }}>
        Legendas, metadados e notas de rodapé vivem aqui, um degrau mais quietas que o corpo.
      </p>
    </div>
  ),
};
