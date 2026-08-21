import { useState } from 'react';
import type { HTMLAttributes, CSSProperties, MouseEvent, ReactNode } from 'react';
import { Icon } from './Icon';

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  /** Selected filter state. */
  active?: boolean;
  /** Renders a trailing remove affordance — a real <button>, focusable and
   * keyboard-operable by default. */
  onRemove?: (e: MouseEvent) => void;
  style?: CSSProperties;
}

export function Tag({ children, active = false, onRemove, onClick, style, ...rest }: TagProps) {
  const [hovered, setHovered] = useState(false);
  const on = active || hovered;

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        padding: onRemove ? '0 6px 0 12px' : '0 12px',
        borderRadius: 'var(--radius-pill)',
        background: active ? 'var(--glass-3)' : on ? 'var(--glass-2)' : 'var(--glass-1)',
        border: `1px solid ${on ? 'var(--line-strong)' : 'var(--line-hairline)'}`,
        color: active ? 'var(--text-heading)' : 'var(--text-secondary)',
        font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
        cursor: onClick ? 'pointer' : 'default',
        transition:
          'background var(--motion-hover), border-color var(--motion-hover), color var(--motion-hover)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remover"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e);
          }}
          style={{
            display: 'inline-flex',
            background: 'none',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
          }}
        >
          <Icon name="x" size="xs" />
        </button>
      )}
    </span>
  );
}
