import type { CSSProperties, ReactNode } from 'react';

export interface TabBarItem {
  id?: string;
  label?: ReactNode;
  icon?: ReactNode;
}

export interface TabBarProps {
  items?: TabBarItem[];
  current?: string;
  onSelect?: (id: string) => void;
  style?: CSSProperties;
}

/** Bottom navigation bar. Respects the safe-area inset. */
export function TabBar({ items = [], current, onSelect, style }: TabBarProps) {
  return (
    <nav
      style={{
        display: 'flex',
        borderTop: '1px solid var(--color-divider)',
        background: 'var(--color-bg)',
        paddingBottom: 'var(--safe-b)',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const id = item.id ?? (typeof item.label === 'string' ? item.label : String(index));
        return (
          <TabBarButton
            key={id}
            item={item}
            active={current === id}
            onSelect={onSelect ? () => onSelect(id) : undefined}
          />
        );
      })}
    </nav>
  );
}

function TabBarButton({
  item,
  active,
  onSelect,
}: {
  item: TabBarItem;
  active: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onSelect}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        minHeight: 'var(--tap)',
        padding: 'var(--space-2) 0',
        color: active
          ? 'var(--color-accent-200)'
          : 'color-mix(in srgb, var(--color-text) 55%, transparent)',
        textDecoration: 'none',
        fontSize: 11,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: 'none',
        border: 0,
        cursor: 'pointer',
      }}
    >
      {item.icon ? (
        <span style={{ display: 'inline-flex', color: active ? 'var(--color-accent)' : undefined }}>
          {item.icon}
        </span>
      ) : null}
      {item.label}
    </button>
  );
}
