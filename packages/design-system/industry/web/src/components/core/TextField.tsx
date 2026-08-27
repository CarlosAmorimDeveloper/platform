import { useId, useState } from 'react';
import type {
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style' | 'children' | 'onFocus' | 'onBlur'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  multiline?: boolean;
  rows?: number;
  style?: CSSProperties;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function TextField({
  label,
  hint,
  error,
  multiline,
  rows = 3,
  id,
  disabled,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const fid = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hintId = `${fid}-hint`;
  const describedBy = error || hint ? hintId : undefined;

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
      ? 'var(--color-accent)'
      : hovered
        ? 'var(--color-divider-strong)'
        : 'var(--color-divider)';

  const fieldStyle: CSSProperties = {
    width: '100%',
    minHeight: multiline ? 104 : 'var(--control-h)',
    padding: multiline ? 'var(--space-2) var(--space-3)' : '0 var(--space-3)',
    font: 'inherit',
    fontSize: 15,
    color: 'var(--color-text)',
    caretColor: 'var(--color-accent)',
    background: 'var(--color-surface)',
    border: `1px solid ${borderColor}`,
    borderRadius: 0,
    resize: multiline ? 'vertical' : undefined,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : undefined,
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      {label ? (
        <label
          htmlFor={fid}
          style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
        >
          {label}
        </label>
      ) : null}
      {multiline ? (
        <textarea
          id={fid}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={fieldStyle}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fid}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={fieldStyle}
          {...rest}
        />
      )}
      {error ? (
        <span id={hintId} style={{ fontSize: 12, color: 'var(--color-danger-300)' }}>
          {error}
        </span>
      ) : hint ? (
        <span
          id={hintId}
          style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
