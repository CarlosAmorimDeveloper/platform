import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

export type ToastTone = 'accent' | 'success' | 'warning' | 'danger';

export interface ToastProps {
  tone?: ToastTone;
  title?: ReactNode;
  onDismiss?: () => void;
  children?: ReactNode;
  style?: CSSProperties;
}

const ACCENT_COLOR: Record<ToastTone, string> = {
  accent: 'var(--color-accent)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
};

/** Stack several inside a `display: flex; flex-direction: column` wrapper. */
export function Toast({ tone = 'accent', title, onDismiss, children, style }: ToastProps) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-divider)',
        boxShadow: 'var(--shadow-md)',
        borderLeft: `2px solid ${ACCENT_COLOR[tone]}`,
        ...style,
      }}
    >
      <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 2 }}>
        {title ? (
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 'var(--font-heading-weight)',
              fontSize: 16,
            }}
          >
            {title}
          </div>
        ) : null}
        {children ? (
          <div
            style={{
              fontSize: 13,
              color: 'color-mix(in srgb, var(--color-text) 65%, transparent)',
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dispensar"
          style={{
            display: 'flex',
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            color: 'var(--color-text)',
          }}
        >
          <Icon name="x" size="sm" />
        </button>
      ) : null}
    </div>
  );
}
