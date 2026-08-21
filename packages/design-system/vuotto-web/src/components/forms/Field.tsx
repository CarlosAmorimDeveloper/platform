import { cloneElement, isValidElement, useId } from 'react';
import type { HTMLAttributes, CSSProperties, ReactElement, ReactNode } from 'react';

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  label?: string;
  /** Mono helper text below the control. */
  hint?: string;
  /** Replaces the hint, turns it red, and wires `aria-invalid` + `aria-describedby` onto the child control. */
  error?: string;
  required?: boolean;
  /** Passed to both the <label> and the child control's `id`. Auto-generated when omitted, so every Field is accessible without the caller having to invent an id. */
  htmlFor?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Field({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  style,
  ...rest
}: FieldProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = `${controlId}-hint`;
  const hasMessage = Boolean(error || hint);

  const wiredChildren =
    isValidElement(children) && (label || hasMessage)
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          id: (children.props as { id?: string }).id ?? controlId,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': hasMessage ? hintId : undefined,
        })
      : children;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...style }}
      {...rest}
    >
      {label && (
        <label
          htmlFor={controlId}
          style={{
            font: 'var(--weight-medium) var(--text-sm)/1.2 var(--font-sans)',
            color: 'var(--text-heading)',
            letterSpacing: 'var(--tracking-tight)',
            display: 'inline-flex',
            gap: 6,
            alignItems: 'baseline',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--vt-danger)', font: 'var(--label-mono)' }}>*</span>
          )}
        </label>
      )}
      {wiredChildren}
      {hasMessage && (
        <span
          id={hintId}
          style={{
            font: 'var(--weight-regular) var(--text-xs)/1.45 var(--font-mono)',
            color: error ? 'var(--vt-danger)' : 'var(--text-tertiary)',
          }}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}
