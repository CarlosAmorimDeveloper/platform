import type { HTMLAttributes, CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface TabBarItem {
  value: string;
  label: string;
  icon: string;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onChange'> {
  /** Bottom navigation reads poorly past 5 items — keep it to 3–5. */
  items?: TabBarItem[];
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

export function TabBar({ items = [], value, onChange, style, ...rest }: TabBarProps) {
  return (
    <nav
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + items.length + ', 1fr)',
        padding: '8px 8px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--glass-2)',
        backdropFilter: 'var(--glass-blur)',
        borderTop: '1px solid var(--line-hairline)',
        ...style,
      }}
      {...rest}
    >
      {items.map((it) => {
        const on = value === it.value;
        return (
          <button
            key={it.value}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onChange?.(it.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minHeight: 'var(--touch-min)',
              padding: '6px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: on ? 'var(--text-heading)' : 'var(--text-tertiary)',
              transition: 'color var(--motion-hover)',
            }}
          >
            <Icon name={it.icon} size="md" />
            <span style={{ font: 'var(--weight-medium) 11px/1 var(--font-sans)' }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
