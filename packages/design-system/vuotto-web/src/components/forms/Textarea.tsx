import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes, CSSProperties } from 'react';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  rows?: number;
  invalid?: boolean;
  /** Mono character counter pinned bottom-right, e.g. "84/280". */
  counter?: string;
  style?: CSSProperties;
}

/** Multi-line text. Vertical resize only. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { rows = 4, invalid = false, counter, disabled = false, onFocus, onBlur, style, ...rest },
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
        position: 'relative',
        background: 'var(--surface-input)',
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        backdropFilter: 'var(--glass-blur)',
        opacity: disabled ? 0.42 : 1,
        transition: 'border-color var(--motion-hover), box-shadow var(--motion-hover)',
        ...style,
      }}
    >
      <textarea
        ref={ref}
        rows={rows}
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
          display: 'block',
          width: '100%',
          resize: 'vertical',
          padding: '10px 12px',
          background: 'none',
          border: 'none',
          outline: 'none',
          font: 'var(--weight-regular) var(--text-md)/var(--leading-normal) var(--font-sans)',
          color: 'var(--text-heading)',
        }}
        {...rest}
      />
      {counter && (
        <span
          style={{
            position: 'absolute',
            right: 10,
            bottom: 8,
            font: 'var(--label-mono)',
            color: 'var(--text-tertiary)',
          }}
        >
          {counter}
        </span>
      )}
    </div>
  );
});
