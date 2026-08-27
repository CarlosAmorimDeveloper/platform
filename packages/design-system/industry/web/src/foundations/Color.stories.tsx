import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Color',
};

export default meta;
type Story = StoryObj;

const ROLES = [
  { label: 'bg', value: 'var(--color-bg)' },
  { label: 'surface', value: 'var(--color-surface)' },
  { label: 'text', value: 'var(--color-text)' },
  { label: 'accent', value: 'var(--color-accent)' },
];

const RAMP_STEPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

export const Roles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {ROLES.map((role) => (
        <div key={role.label} style={{ flex: 1 }}>
          <div
            style={{
              height: 32,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--color-text) 18%, transparent)',
              background: role.value,
            }}
          />
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, color: 'var(--color-text)' }}>
            {role.label}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TonalRamps: Story = {
  render: () => (
    <div>
      {(['neutral', 'accent'] as const).map((prefix) => (
        <div
          key={prefix}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            margin: 'var(--space-2) 0',
          }}
        >
          <span
            style={{
              flex: 'none',
              width: 64,
              fontSize: 10,
              letterSpacing: '0.08em',
              opacity: 0.45,
              color: 'var(--color-text)',
              textTransform: 'capitalize',
            }}
          >
            {prefix}
          </span>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {RAMP_STEPS.map((step) => (
              <div
                key={step}
                title={step}
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 'var(--radius-sm)',
                  background: `var(--color-${prefix}-${step})`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Usage: Story = {
  render: () => (
    <p style={{ fontSize: 12, opacity: 0.6, maxWidth: '60ch', color: 'var(--color-text)' }}>
      Nesta base a leitura inverte em relação a um tema claro:{' '}
      <strong>300 é o passo legível</strong> para tipo e ícones sobre o grafite, <code>400</code> é
      o preenchimento (botões, barras, pontos), <code>900</code> tinge uma superfície e 100–200 são
      para tipo sobre esses preenchimentos. 500–700 são os passos de hover e pressed. Prefira um
      passo da rampa a montar um <code>color-mix()</code> improvisado. As três rampas semânticas —
      success, warning e danger — estão em Foundations/Semantics.
    </p>
  ),
};
