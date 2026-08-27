import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Popover } from './Popover';
import type { PopoverAlign, PopoverSide } from './Popover';

export interface MenuItem {
  key?: string;
  label: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  /** Usually a `<Button>` or `<IconButton>` — receives the click that opens the menu. */
  trigger: ReactNode;
  items?: MenuItem[];
  side?: PopoverSide;
  align?: PopoverAlign;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: CSSProperties;
}

/** Anchored dropdown list of actions. Use `Select` instead for choosing a value. */
export function Menu({
  trigger,
  items = [],
  side = 'bottom',
  align = 'start',
  open: controlledOpen,
  onOpenChange,
  style,
}: MenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (controlledOpen === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <Popover
      trigger={trigger}
      side={side}
      align={align}
      open={open}
      onOpenChange={setOpen}
      style={style}
    >
      <div
        role="menu"
        style={{ display: 'flex', flexDirection: 'column', margin: 'calc(var(--space-3) * -1)' }}
      >
        {items.map((item, index) => (
          <MenuItemButton
            key={item.key ?? index}
            item={item}
            onSelect={() => {
              item.onSelect?.();
              setOpen(false);
            }}
          />
        ))}
      </div>
    </Popover>
  );
}

function MenuItemButton({ item, onSelect }: { item: MenuItem; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      role="menuitem"
      disabled={item.disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: 'var(--space-2) var(--space-3)',
        background:
          hovered && !item.disabled
            ? 'color-mix(in srgb, var(--color-text) 8%, transparent)'
            : 'transparent',
        border: 0,
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        opacity: item.disabled ? 0.45 : 1,
        font: 'inherit',
        fontSize: 14,
        color: 'var(--color-text)',
      }}
    >
      {item.label}
    </button>
  );
}
