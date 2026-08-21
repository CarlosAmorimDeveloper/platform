import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';

const SCALE = { sm: 0.8, md: 1, lg: 1.5 };

export type LockupSize = keyof typeof SCALE;

export interface LockupProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  size?: LockupSize;
  /** Stacks "TECH" under "Vuotto" instead of beside it. */
  stacked?: boolean;
  /**
   * No logo symbol exists yet (readme.md: "Envie um SVG e ele substitui esse
   * lockup"). When given, this replaces the type lockup entirely — the
   * wordmark is the placeholder, not the default users are meant to keep.
   */
  logo?: ReactNode;
  style?: CSSProperties;
}

/** Vuotto Tech wordmark. No logo symbol exists — the lockup is type only. */
export function Lockup({ size = 'md', stacked = false, logo, style, ...rest }: LockupProps) {
  if (logo) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', ...style }} {...rest}>
        {logo}
      </span>
    );
  }

  const scale = SCALE[size];
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'baseline',
        gap: stacked ? 2 : 8,
        color: 'var(--text-heading)',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          font: `var(--weight-regular) ${22 * scale}px/1 var(--font-display)`,
          letterSpacing: '-0.02em',
        }}
      >
        Vuotto
      </span>
      <span
        style={{
          font: `var(--weight-medium) ${10 * scale}px/1 var(--font-mono)`,
          letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}
      >
        Tech
      </span>
    </span>
  );
}
