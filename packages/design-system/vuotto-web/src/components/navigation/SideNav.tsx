import { useEffect, useRef } from 'react';
import type { HTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { zIndex } from '@vuotto/tokens';
import { Icon } from '../core/Icon';
import { useMediaQuery } from './useMediaQuery';

export interface SideNavItem {
  value: string;
  label: string;
  icon?: string;
  count?: number | string;
}

export interface SideNavGroup {
  label?: string;
  items: SideNavItem[];
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface SideNavProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onChange'> {
  groups?: SideNavGroup[];
  value?: string;
  onChange?: (value: string) => void;
  /** Usually a <Lockup />. */
  header?: ReactNode;
  footer?: ReactNode;
  width?: number;
  /** Icon-only mode — the label survives as the browser's native `title` tooltip + `aria-label`. */
  collapsed?: boolean;
  /** Drawer open state below 900px. Ignored (sidebar always visible) above that breakpoint. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: CSSProperties;
}

/**
 * Primary console navigation: mono group labels, glass active row. Below
 * 900px it becomes a drawer with a scrim and a hand-rolled focus trap — the
 * standalone `Dialog` component (which will formalize this pattern) doesn't
 * exist yet, it's REB-30 in the Feedback epic.
 */
export function SideNav({
  groups = [],
  value,
  onChange,
  header,
  footer,
  width = 232,
  collapsed = false,
  open = false,
  onOpenChange,
  style,
  ...rest
}: SideNavProps) {
  const isNarrow = useMediaQuery('(max-width: 899px)');
  const navRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const drawerOpen = isNarrow && open;

  useEffect(() => {
    if (!drawerOpen) return;
    triggerRef.current = document.activeElement;
    const container = navRef.current;
    const focusables = container?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [drawerOpen]);

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!drawerOpen) return;
    if (e.key === 'Escape') {
      onOpenChange?.(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const container = navRef.current;
    if (!container) return;
    const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const content = (
    <nav
      ref={navRef}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        width: collapsed ? 64 : width,
        flex: '0 0 auto',
        height: isNarrow ? '100%' : undefined,
        padding: collapsed ? 'var(--space-5) var(--space-2)' : 'var(--space-5) var(--space-4)',
        borderRight: isNarrow ? 'none' : '1px solid var(--line-hairline)',
        background: 'var(--glass-1)',
        backdropFilter: 'var(--glass-blur)',
        overflowY: 'auto',
        transition: 'width var(--motion-panel)',
        ...style,
      }}
      {...rest}
    >
      {header}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', flex: 1 }}>
        {groups.map((g, gi) => (
          <div key={g.label || gi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {g.label && !collapsed && (
              <span
                style={{
                  padding: '0 10px 8px',
                  font: 'var(--label-mono)',
                  letterSpacing: 'var(--tracking-label)',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                {g.label}
              </span>
            )}
            {g.items.map((it) => {
              const on = value === it.value;
              return (
                <button
                  key={it.value}
                  type="button"
                  aria-current={on ? 'page' : undefined}
                  aria-label={collapsed ? it.label : undefined}
                  title={collapsed ? it.label : undefined}
                  onClick={() => onChange?.(it.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    gap: 'var(--space-3)',
                    height: 36,
                    padding: collapsed ? 0 : '0 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: on ? 'var(--glass-3)' : 'transparent',
                    border: '1px solid ' + (on ? 'var(--line-hairline)' : 'transparent'),
                    color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
                    font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background var(--motion-hover), color var(--motion-hover)',
                  }}
                >
                  {it.icon && <Icon name={it.icon} size="sm" />}
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1 }}>{it.label}</span>
                      {it.count != null && (
                        <span style={{ font: 'var(--label-mono)', color: 'var(--text-tertiary)' }}>
                          {it.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {footer}
    </nav>
  );

  if (!isNarrow) return content;
  if (!open) return null;

  return (
    <div
      onClick={() => onOpenChange?.(false)}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--glass-scrim)',
        zIndex: zIndex.overlay,
        display: 'flex',
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{content}</div>
    </div>
  );
}
