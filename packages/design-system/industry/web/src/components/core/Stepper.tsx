import type { CSSProperties, ReactNode } from 'react';

export interface Step {
  label?: ReactNode;
}

export interface StepperProps {
  steps?: (string | Step)[];
  /** Zero-based index of the current step. Earlier steps read as done. */
  current?: number;
  style?: CSSProperties;
}

function resolveStep(step: string | Step): Step {
  return typeof step === 'string' ? { label: step } : step;
}

export function Stepper({ steps = [], current = 0, style }: StepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', ...style }}>
      {steps.map((step, index) => {
        const { label } = resolveStep(step);
        const done = index < current;
        const isCurrent = index === current;

        return (
          <div
            key={typeof label === 'string' ? label : index}
            aria-current={isCurrent ? 'step' : undefined}
            style={{
              flex: 1,
              display: 'grid',
              gap: 'var(--space-2)',
              justifyItems: 'center',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 13,
                  left: 0,
                  right: '50%',
                  height: 1,
                  background: 'var(--color-divider)',
                }}
              />
            ) : null}
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 13,
                  left: '50%',
                  right: 0,
                  height: 1,
                  background: 'var(--color-divider)',
                }}
              />
            ) : null}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: 28,
                height: 28,
                display: 'grid',
                placeItems: 'center',
                background: done ? 'var(--color-accent)' : 'var(--color-bg)',
                border: `1px solid ${done || isCurrent ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
                boxShadow: isCurrent
                  ? '0 0 0 3px color-mix(in srgb, var(--color-accent) 20%, transparent)'
                  : 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: done
                  ? 'var(--color-bg)'
                  : isCurrent
                    ? 'var(--color-accent-200)'
                    : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
              }}
            >
              {done ? '✓' : index + 1}
            </div>
            <div
              style={{
                fontSize: 13,
                color: isCurrent
                  ? 'var(--color-text)'
                  : done
                    ? 'color-mix(in srgb, var(--color-text) 75%, transparent)'
                    : 'color-mix(in srgb, var(--color-text) 55%, transparent)',
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
