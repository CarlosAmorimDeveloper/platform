import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface TabItem {
  id?: string;
  label?: ReactNode;
  icon?: ReactNode;
  count?: number;
}

export interface TabsProps {
  items?: (string | TabItem)[];
  current?: string;
  onSelect?: (id: string) => void;
  style?: CSSProperties;
}

function resolveTab(item: string | TabItem): TabItem {
  return typeof item === 'string' ? { id: item, label: item } : item;
}

export function Tabs({ items = [], current, onSelect, style }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        borderBottom: '1px solid var(--color-divider)',
        ...style,
      }}
    >
      {items.map((item, index) => {
        const tab = resolveTab(item);
        const id = tab.id ?? (typeof tab.label === 'string' ? tab.label : String(index));
        return (
          <TabButton
            key={id}
            tab={tab}
            active={current === id}
            onSelect={onSelect ? () => onSelect(id) : undefined}
          />
        );
      })}
    </div>
  );
}

function TabButton({
  tab,
  active,
  onSelect,
}: {
  tab: TabItem;
  active: boolean;
  onSelect?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        minHeight: 'var(--control-h)',
        padding: '0 2px',
        marginBottom: -1,
        cursor: 'pointer',
        background: 'none',
        border: 0,
        borderBottom: `2px solid ${active ? 'var(--color-accent)' : 'transparent'}`,
        color:
          active || hovered
            ? 'var(--color-text)'
            : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--font-heading-weight)',
        fontSize: 16,
      }}
    >
      {tab.icon}
      {tab.label}
      {tab.count != null ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 12,
            letterSpacing: '0.02em',
            padding: '3px 10px',
            borderRadius: 0,
            background: 'var(--color-neutral-900)',
            color: 'var(--color-neutral-200)',
          }}
        >
          {tab.count}
        </span>
      ) : null}
    </button>
  );
}
