import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

const HEIGHTS = { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)' };
const PADS = { sm: '0 12px', md: '0 18px', lg: '0 24px' };
const FONTS = { sm: 'var(--text-sm)', md: 'var(--text-md)', lg: 'var(--text-md)' };

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children?: ReactNode;
  /** primary = light fill; secondary = glass; ghost = text only; danger = tinted destructive. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Lucide icon name rendered before the label. */
  icon?: string;
  /** Lucide icon name rendered after the label. */
  iconAfter?: string;
  disabled?: boolean;
  /** Swaps the leading icon for a loader and blocks input. */
  loading?: boolean;
  fullWidth?: boolean;
  style?: CSSProperties;
}

function skin(variant: ButtonVariant, hovered: boolean): CSSProperties {
  if (variant === 'primary') {
    return {
      background: hovered ? 'var(--vt-pure)' : 'var(--vt-white)',
      color: 'var(--text-inverse)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-inset-top), var(--shadow-sm)',
    };
  }
  if (variant === 'secondary') {
    return {
      background: hovered ? 'var(--glass-3)' : 'var(--glass-2)',
      color: 'var(--text-heading)',
      border: `1px solid ${hovered ? 'var(--line-strong)' : 'var(--line-hairline)'}`,
      backdropFilter: 'var(--glass-blur)',
      boxShadow: 'var(--shadow-inset-top)',
    };
  }
  if (variant === 'ghost') {
    return {
      background: hovered ? 'var(--glass-1)' : 'transparent',
      color: hovered ? 'var(--text-heading)' : 'var(--text-secondary)',
      border: '1px solid transparent',
    };
  }
  return {
    background: hovered
      ? 'color-mix(in oklab, var(--vt-danger) 26%, transparent)'
      : 'color-mix(in oklab, var(--vt-danger) 16%, transparent)',
    color: 'var(--vt-danger)',
    border: '1px solid color-mix(in oklab, var(--vt-danger) 38%, transparent)',
  };
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        height: HEIGHTS[size],
        padding: PADS[size],
        minWidth: 0,
        width: fullWidth ? '100%' : 'auto',
        font: `var(--weight-semibold) ${FONTS[size]}/1 var(--font-sans)`,
        letterSpacing: 'var(--tracking-tight)',
        borderRadius: 'var(--radius-sm)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        transform: pressed && !disabled ? 'scale(0.985)' : 'none',
        transition:
          'background var(--motion-hover), border-color var(--motion-hover), color var(--motion-hover), transform var(--dur-fast) var(--ease-out)',
        whiteSpace: 'nowrap',
        ...skin(variant, hovered && !disabled),
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <Icon name="loader-circle" size="xs" className="vt-spin" />
      ) : icon ? (
        <Icon name={icon} size={size === 'sm' ? 'xs' : 'sm'} />
      ) : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={size === 'sm' ? 'xs' : 'sm'} /> : null}
    </button>
  );
}
