import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, CSSProperties, KeyboardEvent } from 'react';
import { Icon } from '../core/Icon';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: string;
}

export interface SegmentedControlProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'onChange'
> {
  options?: (string | SegmentedOption)[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: CSSProperties;
}

/**
 * 2–4 mutually exclusive short options in one row. Plain `<button>`s don't
 * get roving-tabindex/arrow-key behaviour the way grouped native radios do
 * (see `RadioGroup`), so this wires it by hand: `role="radiogroup"` on the
 * container, `role="radio"` + a single `tabIndex={0}` (on the selected
 * option) per button, and ArrowLeft/ArrowRight moving both selection and
 * focus together.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { options = [], value, onChange, size = 'md', fullWidth = false, style, ...rest },
    ref,
  ) {
    const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const h = size === 'sm' ? 30 : 36;

    const select = (index: number) => {
      const opt = normalized[index];
      if (!opt) return;
      onChange?.(opt.value);
      buttonRefs.current[index]?.focus();
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = normalized.findIndex((o) => o.value === value);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        select((currentIndex + 1 + normalized.length) % normalized.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        select((currentIndex - 1 + normalized.length) % normalized.length);
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        onKeyDown={onKeyDown}
        style={{
          display: 'inline-flex',
          gap: 2,
          padding: 3,
          width: fullWidth ? '100%' : 'auto',
          background: 'var(--glass-1)',
          border: '1px solid var(--line-hairline)',
          borderRadius: 'var(--radius-sm)',
          backdropFilter: 'var(--glass-blur)',
          ...style,
        }}
        {...rest}
      >
        {normalized.map((opt, index) => {
          const on = value === opt.value;
          return (
            <button
              key={opt.value}
              ref={(node) => {
                buttonRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => select(index)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                flex: fullWidth ? 1 : '0 0 auto',
                height: h,
                padding: '0 12px',
                borderRadius: 7,
                border: `1px solid ${on ? 'var(--line-hairline)' : 'transparent'}`,
                background: on ? 'var(--glass-3)' : 'transparent',
                color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
                font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background var(--motion-hover), color var(--motion-hover)',
              }}
            >
              {opt.icon && <Icon name={opt.icon} size="xs" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  },
);
