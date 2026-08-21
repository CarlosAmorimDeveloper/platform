import type { HTMLAttributes, CSSProperties } from 'react';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  value?: number;
  max?: number;
  /** Mono label above the track. */
  label?: string;
  showValue?: boolean;
  tone?: 'neutral' | 'cool' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  tone = 'neutral',
  size = 'md',
  style,
  ...rest
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill =
    tone === 'success'
      ? 'var(--vt-success)'
      : tone === 'warning'
        ? 'var(--vt-warning)'
        : tone === 'danger'
          ? 'var(--vt-danger)'
          : tone === 'cool'
            ? 'var(--vt-cool)'
            : 'var(--vt-white)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }} {...rest}>
      {(label || showValue) && (
        <span
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: 'var(--label-mono)',
            color: 'var(--text-tertiary)',
          }}
        >
          <span>{label}</span>
          {showValue && <span style={{ color: 'var(--text-secondary)' }}>{Math.round(pct)}%</span>}
        </span>
      )}
      <span
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          display: 'block',
          height: size === 'sm' ? 4 : 6,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--glass-3)',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            display: 'block',
            width: pct + '%',
            height: '100%',
            background: fill,
            borderRadius: 'var(--radius-pill)',
            transition: 'width var(--motion-panel)',
          }}
        />
      </span>
    </div>
  );
}
