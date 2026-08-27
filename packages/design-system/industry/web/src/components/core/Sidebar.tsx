import { useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

export interface SidebarItem {
  id?: string;
  label?: ReactNode;
  icon?: ReactNode;
  href?: string;
  /** Renders a group label instead of a link. */
  section?: ReactNode;
}

export interface SidebarProps {
  brand?: ReactNode;
  items?: SidebarItem[];
  /** id (or label) of the active item. */
  current?: string;
  onSelect?: (id: string) => void;
  footer?: ReactNode;
  style?: CSSProperties;
}

const BRAND_STYLE: CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontWeight: 'var(--font-heading-weight)',
  fontSize: 19,
  padding: '0 var(--space-2) var(--space-4)',
};

const SECTION_STYLE: CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  opacity: 0.45,
  padding: 'var(--space-4) var(--space-2) var(--space-1)',
};

export function Sidebar({ brand, items = [], current, onSelect, footer, style }: SidebarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        padding: 'var(--space-4) var(--space-3)',
        borderRight: '1px solid var(--color-divider)',
        ...style,
      }}
    >
      {brand ? <div style={BRAND_STYLE}>{brand}</div> : null}
      {items.map((item, index) => {
        if (item.section) {
          return (
            <div key={`section-${index}`} style={SECTION_STYLE}>
              {item.section}
            </div>
          );
        }
        const id = item.id ?? (typeof item.label === 'string' ? item.label : String(index));
        return (
          <SidebarLink
            key={id}
            item={item}
            active={current === id}
            onSelect={onSelect ? () => onSelect(id) : undefined}
          />
        );
      })}
      {footer}
    </nav>
  );
}

function SidebarLink({
  item,
  active,
  onSelect,
}: {
  item: SidebarItem;
  active: boolean;
  onSelect?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={item.href ?? '#'}
      aria-current={active ? 'page' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={
        onSelect
          ? (e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              onSelect();
            }
          : undefined
      }
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 'var(--tap)',
        padding: '0 var(--space-2)',
        color: active ? 'var(--color-accent-200)' : 'inherit',
        textDecoration: 'none',
        fontSize: 15,
        borderLeft: `2px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
        background: active
          ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)'
          : hovered
            ? 'color-mix(in srgb, var(--color-text) 6%, transparent)'
            : 'transparent',
      }}
    >
      {item.icon}
      {item.label}
    </a>
  );
}
