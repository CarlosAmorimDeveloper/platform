import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const TONES = {
  info: { c: 'var(--vt-cool)', icon: 'info' },
  success: { c: 'var(--vt-success)', icon: 'check-circle' },
  warning: { c: 'var(--vt-warning)', icon: 'triangle-alert' },
  danger: { c: 'var(--vt-danger)', icon: 'octagon-alert' },
};

export type BannerTone = keyof typeof TONES;

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  tone?: BannerTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
}

export function Banner({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  style,
  ...rest
}: BannerProps) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'flex-start',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: `color-mix(in oklab, ${t.c} 10%, transparent)`,
        border: `1px solid color-mix(in oklab, ${t.c} 28%, transparent)`,
        backdropFilter: 'var(--glass-blur)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'flex', marginTop: 1 }}>
        <Icon name={t.icon} size="sm" color={t.c} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {title && (
          <span
            style={{
              font: 'var(--weight-semibold) var(--text-md)/1.3 var(--font-sans)',
              color: 'var(--text-heading)',
            }}
          >
            {title}
          </span>
        )}
        {children && (
          <span
            style={{
              font: 'var(--weight-regular) var(--text-sm)/var(--leading-normal) var(--font-sans)',
              color: 'var(--text-secondary)',
            }}
          >
            {children}
          </span>
        )}
        {action && <span style={{ marginTop: 6 }}>{action}</span>}
      </span>
      {onDismiss && (
        <button
          type="button"
          aria-label="Fechar"
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
          }}
        >
          <Icon name="x" size="sm" />
        </button>
      )}
    </div>
  );
}
