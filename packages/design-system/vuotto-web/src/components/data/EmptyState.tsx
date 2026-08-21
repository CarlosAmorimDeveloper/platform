import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  icon?: string;
  title: string;
  /** Describe the next step, not the absence. */
  body?: string;
  /** Usually a <Button>. */
  action?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState({
  icon = 'inbox',
  title,
  body,
  action,
  style,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: 'var(--glass-2)',
          border: '1px solid var(--line-hairline)',
        }}
      >
        <Icon name={icon} size="lg" color="var(--text-tertiary)" />
      </span>
      <span
        style={{
          font: 'var(--weight-regular) var(--display-sm)/1.1 var(--font-display)',
          color: 'var(--text-heading)',
          letterSpacing: 'var(--tracking-display)',
        }}
      >
        {title}
      </span>
      {body && (
        <span
          style={{
            maxWidth: '42ch',
            font: 'var(--weight-regular) var(--text-md)/var(--leading-normal) var(--font-sans)',
            color: 'var(--text-secondary)',
          }}
        >
          {body}
        </span>
      )}
      {action && <span style={{ marginTop: 'var(--space-2)' }}>{action}</span>}
    </div>
  );
}
