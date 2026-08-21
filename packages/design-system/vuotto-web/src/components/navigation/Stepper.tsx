import type { HTMLAttributes, CSSProperties } from 'react';
import { Icon } from '../core/Icon';

export interface StepItem {
  label: string;
}

export interface StepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  steps?: (string | StepItem)[];
  /** Index of the active step; earlier steps render as done. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  style?: CSSProperties;
}

export function Stepper({
  steps = [],
  current = 0,
  orientation = 'horizontal',
  style,
  ...rest
}: StepperProps) {
  const row = orientation === 'horizontal';
  return (
    <div
      role="group"
      aria-label={`Passo ${current + 1} de ${steps.length}`}
      style={{
        display: 'flex',
        flexDirection: row ? 'row' : 'column',
        gap: row ? 'var(--space-4)' : 'var(--space-3)',
        alignItems: row ? 'center' : 'stretch',
        ...style,
      }}
      {...rest}
    >
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} style={{ display: 'contents' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                flex: row ? '0 0 auto' : 'initial',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: done ? 'var(--vt-white)' : active ? 'var(--glass-3)' : 'transparent',
                  border:
                    '1px solid ' +
                    (done ? 'transparent' : active ? 'var(--line-focus)' : 'var(--line-hairline)'),
                  color: done ? 'var(--text-inverse)' : 'var(--text-secondary)',
                  font: 'var(--weight-medium) 11px/1 var(--font-mono)',
                }}
              >
                {done ? <Icon name="check" size="xs" /> : i + 1}
              </span>
              <span
                style={{
                  font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
                  color: active
                    ? 'var(--text-heading)'
                    : done
                      ? 'var(--text-secondary)'
                      : 'var(--text-tertiary)',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </span>
            {row && i < steps.length - 1 && (
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: done ? 'var(--line-strong)' : 'var(--line-hairline)',
                  minWidth: 20,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
