import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const numberFormatter = new Intl.NumberFormat('pt-BR');

export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Mono uppercase eyebrow. */
  label: string;
  /** Rendered in the display serif. A `number` is formatted via `Intl.NumberFormat('pt-BR')`. */
  value: ReactNode | number;
  unit?: string;
  /** Change figure, e.g. "+12,4%". */
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  footnote?: string;
  style?: CSSProperties;
}

export function Stat({
  label,
  value,
  unit,
  delta,
  trend = 'flat',
  footnote,
  style,
  ...rest
}: StatProps) {
  const tone =
    trend === 'up'
      ? 'var(--vt-success)'
      : trend === 'down'
        ? 'var(--vt-danger)'
        : 'var(--text-tertiary)';
  const renderedValue = typeof value === 'number' ? numberFormatter.format(value) : value;
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}
      {...rest}
    >
      <span
        style={{
          font: 'var(--label-mono)',
          letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}
      >
        {label}
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            font: 'var(--weight-regular) var(--display-sm)/1 var(--font-display)',
            color: 'var(--text-heading)',
            letterSpacing: 'var(--tracking-display)',
          }}
        >
          {renderedValue}
        </span>
        {unit && (
          <span
            style={{
              font: 'var(--weight-regular) var(--text-sm)/1 var(--font-mono)',
              color: 'var(--text-tertiary)',
            }}
          >
            {unit}
          </span>
        )}
        {delta && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              marginLeft: 4,
              color: tone,
              font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)',
            }}
          >
            <Icon
              name={trend === 'down' ? 'trending-down' : trend === 'up' ? 'trending-up' : 'minus'}
              size="xs"
            />
            {delta}
          </span>
        )}
      </span>
      {footnote && (
        <span
          style={{
            font: 'var(--weight-regular) var(--text-xs)/1.4 var(--font-mono)',
            color: 'var(--text-tertiary)',
          }}
        >
          {footnote}
        </span>
      )}
    </div>
  );
}
