import { forwardRef } from 'react';
import type { HTMLAttributes, CSSProperties, MouseEvent } from 'react';

export interface SwitchProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'style' | 'onChange'> {
  checked?: boolean;
  onChange?: (next: boolean, e: MouseEvent) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

/**
 * Instant-effect toggle. `role="switch"` + `aria-checked` + a real
 * `<button>` (Space/Enter activation comes free from the native element,
 * no keydown handler needed).
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked = false, onChange, label, description, disabled = false, style, ...rest },
  ref,
) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: 'var(--space-4)',
        minHeight: 'var(--touch-min)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.42 : 1,
        ...style,
      }}
      {...rest}
    >
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => onChange?.(!checked, e)}
        style={{
          position: 'relative',
          width: 40,
          height: 24,
          flex: '0 0 auto',
          marginTop: description ? 2 : 0,
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--vt-white)' : 'var(--glass-3)',
          border: `1px solid ${checked ? 'transparent' : 'var(--line-strong)'}`,
          cursor: 'inherit',
          padding: 0,
          transition: 'background var(--motion-hover), border-color var(--motion-hover)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: checked ? 'var(--vt-black)' : 'var(--vt-soft)',
            transition: 'left var(--dur-base) var(--ease-out)',
          }}
        />
      </button>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {label && (
            <span
              style={{
                font: 'var(--weight-medium) var(--text-md)/1.35 var(--font-sans)',
                color: 'var(--text-heading)',
              }}
            >
              {label}
            </span>
          )}
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
      )}
    </label>
  );
});
