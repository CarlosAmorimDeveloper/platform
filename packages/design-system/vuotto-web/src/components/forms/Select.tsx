import { forwardRef, useState } from 'react';
import type { SelectHTMLAttributes, CSSProperties } from 'react';
import { Icon } from '../core/Icon';

const HEIGHTS = { sm: 'var(--control-sm)', md: 'var(--control-md)', lg: 'var(--control-lg)' };

export type SelectSize = keyof typeof HEIGHTS;
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'size' | 'style' | 'children'
> {
  /** Plain strings or {value,label} pairs. */
  options?: (string | SelectOption)[];
  size?: SelectSize;
  invalid?: boolean;
  style?: CSSProperties;
}

/** Native select with brand chrome — use for 4+ options; below that use `RadioGroup` or `SegmentedControl`. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options = [], size = 'md', invalid = false, disabled = false, onFocus, onBlur, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: HEIGHTS[size],
        background: 'var(--surface-input)',
        border: `1px solid ${
          invalid
            ? 'color-mix(in oklab, var(--vt-danger) 55%, transparent)'
            : focused
              ? 'var(--line-focus)'
              : 'var(--line-hairline)'
        }`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        backdropFilter: 'var(--glass-blur)',
        opacity: disabled ? 0.42 : 1,
        ...style,
      }}
    >
      <select
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
          appearance: 'none',
          WebkitAppearance: 'none',
          flex: 1,
          height: '100%',
          padding: '0 34px 0 12px',
          background: 'none',
          border: 'none',
          outline: 'none',
          font: 'var(--weight-regular) var(--text-md)/1 var(--font-sans)',
          color: 'var(--text-heading)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        {...rest}
      >
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option
              key={opt.value}
              value={opt.value}
              style={{ background: 'var(--surface-solid)' }}
            >
              {opt.label}
            </option>
          );
        })}
      </select>
      {/* pointerEvents: none — the chevron sits over the native select's own
          click target without intercepting it, matching the acceptance
          criterion literally. */}
      <span style={{ position: 'absolute', right: 10, display: 'flex', pointerEvents: 'none' }}>
        <Icon name="chevron-down" size="sm" color="var(--text-tertiary)" />
      </span>
    </div>
  );
});
