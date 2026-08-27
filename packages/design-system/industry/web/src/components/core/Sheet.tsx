import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface SheetProps {
  open?: boolean;
  title?: ReactNode;
  onDismiss?: () => void;
  /** Action row pinned under the content. */
  actions?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}

/** Bottom sheet — positions against its nearest positioned ancestor. */
export function Sheet({ open = true, title, onDismiss, actions, children, style }: SheetProps) {
  if (!open) return null;

  const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgb(0 0 0 / 0.6)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={stopPropagation}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4) calc(var(--space-6) + var(--safe-b))',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-divider-strong)',
          boxShadow: 'var(--shadow-lg)',
          ...style,
        }}
      >
        <div
          style={{
            width: 44,
            height: 3,
            background: 'var(--color-divider-strong)',
            alignSelf: 'center',
          }}
        />
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
        {children}
        {actions}
      </div>
    </div>
  );
}
