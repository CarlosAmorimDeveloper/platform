import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';
import { Icon } from './Icon';

const BOX = { sm: 32, md: 40, lg: 44 };

export type IconButtonVariant = 'ghost' | 'solid' | 'pill';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Lucide icon name. */
  icon: string;
  /** Required — becomes aria-label and title. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Sticky hover styling for toggled toolbar buttons. */
  active?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  active = false,
  disabled = false,
  style,
  ...rest
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false);
  const on = active || (hovered && !disabled);
  const solid = variant === 'solid';

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: BOX[size],
        height: BOX[size],
        borderRadius: variant === 'pill' ? 'var(--radius-pill)' : 'var(--radius-sm)',
        background: solid ? 'var(--vt-white)' : on ? 'var(--glass-2)' : 'transparent',
        color: solid ? 'var(--text-inverse)' : on ? 'var(--text-heading)' : 'var(--text-secondary)',
        border: `1px solid ${on && !solid ? 'var(--line-strong)' : 'transparent'}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        transition:
          'background var(--motion-hover), color var(--motion-hover), border-color var(--motion-hover)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} />
    </button>
  );
}
