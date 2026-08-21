import { forwardRef, useEffect, useRef } from 'react';
import type { ChangeEvent, HTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from '../core/Icon';

export interface CheckboxProps extends Omit<
  HTMLAttributes<HTMLLabelElement>,
  'style' | 'onChange'
> {
  label: ReactNode;
  /** Secondary line under the label. */
  description?: string;
  checked?: boolean;
  /**
   * Sets the real DOM `indeterminate` property on the underlying
   * `<input>` — that property has no HTML attribute equivalent, it can
   * only be set imperatively via a ref, which is what this does.
   */
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    checked = false,
    indeterminate = false,
    disabled = false,
    onChange,
    style,
    ...rest
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLInputElement>(null);
  const on = checked || indeterminate;

  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: description ? 'flex-start' : 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        minHeight: 'var(--touch-min)',
        ...style,
      }}
      {...rest}
    >
      <input
        ref={(node) => {
          innerRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
      />
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          marginTop: description ? 2 : 0,
          flex: '0 0 auto',
          borderRadius: 'var(--radius-xs)',
          background: on ? 'var(--vt-white)' : 'var(--surface-input)',
          border: `1px solid ${on ? 'transparent' : 'var(--line-strong)'}`,
          color: 'var(--text-inverse)',
          transition: 'background var(--motion-hover), border-color var(--motion-hover)',
        }}
      >
        {on && <Icon name={indeterminate ? 'minus' : 'check'} size="xs" />}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            font: 'var(--weight-medium) var(--text-md)/1.35 var(--font-sans)',
            color: 'var(--text-heading)',
          }}
        >
          {label}
        </span>
        {description && (
          <span
            style={{
              font: 'var(--weight-regular) var(--text-sm)/1.45 var(--font-sans)',
              color: 'var(--text-secondary)',
            }}
          >
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
