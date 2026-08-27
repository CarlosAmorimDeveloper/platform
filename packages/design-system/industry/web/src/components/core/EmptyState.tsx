import type { CSSProperties, ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  /** Usually a primary `<Button>`. */
  action?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState({ icon, title, body, action, style }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        justifyItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-12) var(--space-6)',
        border: '1px dashed var(--color-divider)',
        ...style,
      }}
    >
      {icon ? <div style={{ color: 'var(--color-accent-400)', opacity: 0.8 }}>{icon}</div> : null}
      {title ? (
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 'var(--font-heading-weight)',
            fontSize: 21,
          }}
        >
          {title}
        </div>
      ) : null}
      {body ? (
        <p
          style={{
            fontSize: 14,
            maxWidth: '42ch',
            color: 'color-mix(in srgb, var(--color-text) 60%, transparent)',
            margin: 0,
          }}
        >
          {body}
        </p>
      ) : null}
      {action}
    </div>
  );
}
