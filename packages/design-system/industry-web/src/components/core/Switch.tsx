import { useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'style'> {
  label?: ReactNode;
  style?: CSSProperties;
}

export function Switch({
  label,
  checked,
  defaultChecked,
  disabled,
  style,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const [focused, setFocused] = useState(false);
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
        checked={checked !== undefined ? checked : undefined}
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
          position: 'relative',
          width: 44,
          height: 24,
          flex: 'none',
          border: `1px solid ${isChecked ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
          background: isChecked
            ? 'color-mix(in srgb, var(--color-accent) 28%, transparent)'
            : 'var(--color-surface)',
          opacity: disabled ? 0.45 : 1,
          outline: focused ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: 2,
          transition: 'background 140ms ease, border-color 140ms ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: isChecked ? 23 : 3,
            width: 16,
            height: 16,
            background: isChecked ? 'var(--color-accent)' : 'var(--color-neutral-400)',
            transition: 'left 140ms ease, background 140ms ease',
          }}
        />
      </span>
      {label}
    </label>
  );
}
