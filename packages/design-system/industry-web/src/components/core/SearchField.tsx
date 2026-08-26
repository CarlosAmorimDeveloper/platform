import { useState } from 'react';
import type { CSSProperties, FocusEvent, InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style' | 'onFocus' | 'onBlur'
> {
  style?: CSSProperties;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export function SearchField({
  placeholder = 'Search',
  style,
  onFocus,
  onBlur,
  ...rest
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type="search"
        placeholder={placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          width: '100%',
          minHeight: 'var(--control-h)',
          padding: '0 var(--space-3) 0 var(--space-8)',
          font: 'inherit',
          fontSize: 15,
          color: 'var(--color-text)',
          caretColor: 'var(--color-accent)',
          background: 'var(--color-surface)',
          border: `1px solid ${focused ? 'var(--color-accent)' : 'var(--color-divider)'}`,
          borderRadius: 0,
        }}
        {...rest}
      />
      <span
        style={{
          position: 'absolute',
          left: 'var(--space-3)',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.5,
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        <Icon name="search" size="sm" />
      </span>
    </div>
  );
}
