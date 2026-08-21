import { forwardRef, useState } from 'react';
import type { InputHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

const HEIGHTS = { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)' };

export type InputSize = keyof typeof HEIGHTS;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  /** `lg` = 48px — use on mobile viewports for a real touch target. */
  size?: InputSize;
  /** Leading Lucide icon name. */
  icon?: string;
  /** Trailing mono unit or counter, e.g. "min" or "0/120". */
  suffix?: ReactNode;
  invalid?: boolean;
  /** Mono type for IDs, keys, numbers. */
  mono?: boolean;
  style?: CSSProperties;
}

/** Single-line text control on a glass surface. Always inside a `Field`. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    icon,
    suffix,
    invalid = false,
    mono = false,
    disabled = false,
    onFocus,
    onBlur,
    style,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const border = invalid
    ? 'color-mix(in oklab, var(--vt-danger) 55%, transparent)'
    : focused
      ? 'var(--line-focus)'
      : 'var(--line-hairline)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        height: HEIGHTS[size],
        padding: '0 12px',
        background: 'var(--surface-input)',
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-sm)',
        backdropFilter: 'var(--glass-blur)',
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        opacity: disabled ? 0.42 : 1,
        transition: 'border-color var(--motion-hover), box-shadow var(--motion-hover)',
        ...style,
      }}
    >
      {icon && <Icon name={icon} size="sm" color="var(--text-tertiary)" />}
      <input
        ref={ref}
        disabled={disabled}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'none',
          border: 'none',
          outline: 'none',
          font: mono
            ? 'var(--weight-regular) var(--text-sm)/1 var(--font-mono)'
            : 'var(--weight-regular) var(--text-md)/1 var(--font-sans)',
          color: 'var(--text-heading)',
        }}
        {...rest}
      />
      {suffix && (
        <span style={{ font: 'var(--label-mono)', color: 'var(--text-tertiary)' }}>{suffix}</span>
      )}
    </div>
  );
});
