import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

const TONES = {
  neutral: 'var(--vt-mute)',
  success: 'var(--vt-success)',
  warning: 'var(--vt-warning)',
  danger: 'var(--vt-danger)',
  info: 'var(--vt-cool)',
};

export type BadgeTone = keyof typeof TONES;

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  icon?: string;
  style?: CSSProperties;
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  icon,
  style,
  ...rest
}: BadgeProps) {
  const c = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: 22,
        padding: '0 8px',
        borderRadius: 'var(--radius-xs)',
        background: `color-mix(in oklab, ${c} 14%, transparent)`,
        border: `1px solid color-mix(in oklab, ${c} 30%, transparent)`,
        color: c,
        font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />}
      {icon && <Icon name={icon} size="xs" />}
      {children}
    </span>
  );
}
