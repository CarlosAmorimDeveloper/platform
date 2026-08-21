import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  tone?: ToastTone;
  title: string;
  /** Mono detail line — counts, timestamps, ids. */
  description?: string;
  action?: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
}

export function Toast({
  tone = 'neutral',
  title,
  description,
  action,
  onDismiss,
  style,
  ...rest
}: ToastProps) {
  const c =
    tone === 'success'
      ? 'var(--vt-success)'
      : tone === 'danger'
        ? 'var(--vt-danger)'
        : 'var(--text-tertiary)';
  const icon = tone === 'success' ? 'check' : tone === 'danger' ? 'octagon-alert' : 'info';
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        minWidth: 280,
        maxWidth: 400,
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--glass-3)',
        border: '1px solid var(--line-strong)',
        backdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-md)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'flex', marginTop: 2 }}>
        <Icon name={icon} size="sm" color={c} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <span
          style={{
            font: 'var(--weight-semibold) var(--text-sm)/1.35 var(--font-sans)',
            color: 'var(--text-heading)',
          }}
        >
          {title}
        </span>
        {description && (
          <span
            style={{
              font: 'var(--weight-regular) var(--text-xs)/1.5 var(--font-mono)',
              color: 'var(--text-tertiary)',
            }}
          >
            {description}
          </span>
        )}
      </span>
      {action}
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
          <Icon name="x" size="xs" />
        </button>
      )}
    </div>
  );
}
