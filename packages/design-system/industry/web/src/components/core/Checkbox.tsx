import { useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'style' | 'children'
> {
  label?: ReactNode;
  style?: CSSProperties;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled,
  style,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isChecked = checked ?? internalChecked;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalChecked(e.target.checked);
    onChange?.(e);
  };
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 'var(--tap)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 15,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        {...rest}
      />
      <span
        style={{
          width: 18,
          height: 18,
          flex: 'none',
          border: `1.5px solid ${isChecked || (hovered && !disabled) ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
          background: isChecked ? 'var(--color-accent)' : 'transparent',
          display: 'grid',
          placeItems: 'center',
          outline: focused ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: 2,
        }}
      >
        <span
          style={{
            width: 10,
            height: 6,
            borderLeft: '2px solid var(--color-bg)',
            borderBottom: '2px solid var(--color-bg)',
            transform: 'rotate(-45deg) translateY(-1px)',
            opacity: isChecked ? 1 : 0,
          }}
        />
      </span>
      {label}
    </label>
  );
}
