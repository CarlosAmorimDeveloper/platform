import { forwardRef } from 'react';
import type { ChangeEvent, HTMLAttributes, CSSProperties } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  meta?: string;
}

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'onChange'
> {
  name: string;
  options?: (string | RadioOption)[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

/**
 * Single choice among 2–5 options, rendered as selectable glass rows.
 * Arrow-key navigation and the single-tab-stop behaviour come for free from
 * using real native `<input type="radio">` elements sharing one `name` —
 * every browser already implements roving tabindex for grouped radios.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { name, options = [], value, onChange, style, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role="radiogroup"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}
      {...rest}
    >
      {options.map((o) => {
        const opt = typeof o === 'string' ? { value: o, label: o } : o;
        const on = value === opt.value;
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              alignItems: 'center',
              minHeight: 'var(--touch-min)',
              padding: '0 12px',
              borderRadius: 'var(--radius-sm)',
              background: on ? 'var(--glass-2)' : 'transparent',
              border: `1px solid ${on ? 'var(--line-strong)' : 'var(--line-hairline)'}`,
              cursor: 'pointer',
              transition: 'background var(--motion-hover), border-color var(--motion-hover)',
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={on}
              onChange={onChange}
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
            />
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                flex: '0 0 auto',
                border: `1px solid ${on ? 'var(--vt-white)' : 'var(--line-strong)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {on && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--vt-white)',
                  }}
                />
              )}
            </span>
            <span
              style={{
                font: 'var(--weight-medium) var(--text-md)/1.3 var(--font-sans)',
                color: on ? 'var(--text-heading)' : 'var(--text-primary)',
              }}
            >
              {opt.label}
            </span>
            {opt.meta && (
              <span
                style={{
                  marginLeft: 'auto',
                  font: 'var(--label-mono)',
                  color: 'var(--text-tertiary)',
                }}
              >
                {opt.meta}
              </span>
            )}
          </label>
        );
      })}
    </div>
  );
});
