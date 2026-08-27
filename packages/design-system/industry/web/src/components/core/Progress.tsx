import type { CSSProperties, ReactNode } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface ProgressProps {
  value?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  style?: CSSProperties;
}

export function Progress({ value = 0, max = 100, label, showValue = true, style }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div style={style}>
      {label || showValue ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            opacity: 0.6,
            marginBottom: 5,
          }}
        >
          <span>{label}</span>
          {showValue ? <span>{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          height: 4,
          background: 'color-mix(in srgb, var(--color-text) 12%, transparent)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: 'var(--color-accent)',
            transition: 'width 240ms ease',
          }}
        />
      </div>
    </div>
  );
}

export interface SpinnerProps {
  style?: CSSProperties;
}

export function Spinner({ style }: SpinnerProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      role="status"
      aria-label="Carregando"
      style={{
        width: 18,
        height: 18,
        border: '2px solid color-mix(in srgb, var(--color-text) 18%, transparent)',
        borderTopColor: 'var(--color-accent)',
        borderRadius: '50%',
        animation: reducedMotion ? 'none' : 'ind-spin 700ms linear infinite',
        ...style,
      }}
    />
  );
}
