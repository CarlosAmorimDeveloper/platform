import { useId } from 'react';
import { createPortal } from 'react-dom';
import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { zIndex } from '@vuotto/tokens';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Icon } from '../core/Icon';

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  open?: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Action row, right-aligned — usually two <Button>s. */
  footer?: ReactNode;
  onClose?: () => void;
  width?: number;
  style?: CSSProperties;
}

/**
 * Modal for decisions and short forms. Renders in a portal on `document.body`
 * — the prototype was `position: absolute`, meant to be mounted inside an
 * already-positioned screen container, which doesn't hold up as a real
 * component (it would stack under whatever local `position: relative`
 * ancestor happens to exist). `useFocusTrap` (shared with `SideNav`'s
 * drawer) handles the Tab trap, Escape-to-close, focus restoration, and the
 * layout-shift-free scroll lock.
 */
export function Dialog({
  open = true,
  title,
  description,
  children,
  footer,
  onClose,
  width = 460,
  style,
  ...rest
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { containerRef, onKeyDown } = useFocusTrap<HTMLDivElement>(open, onClose);

  // `document` doesn't exist during SSR — this guard matters for any future
  // Next.js consumer (todo-app doesn't use @vuotto/web yet, but nothing here
  // should assume it never will).
  if (open === false || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        background: 'var(--glass-scrim)',
        backdropFilter: 'blur(var(--blur-sm))',
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        style={{
          width,
          maxWidth: '100%',
          padding: 'var(--space-6)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--surface-solid)',
          border: '1px solid var(--line-strong)',
          boxShadow: 'var(--shadow-inset-top), var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          ...style,
        }}
        {...rest}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <span
              id={titleId}
              style={{
                font: 'var(--weight-regular) var(--display-sm)/1.1 var(--font-display)',
                color: 'var(--text-heading)',
                letterSpacing: 'var(--tracking-display)',
              }}
            >
              {title}
            </span>
            {description && (
              <span
                id={descriptionId}
                style={{
                  font: 'var(--weight-regular) var(--text-md)/var(--leading-normal) var(--font-sans)',
                  color: 'var(--text-secondary)',
                }}
              >
                {description}
              </span>
            )}
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                padding: 4,
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
              }}
            >
              <Icon name="x" size="sm" />
            </button>
          )}
        </div>
        {children}
        {footer && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
