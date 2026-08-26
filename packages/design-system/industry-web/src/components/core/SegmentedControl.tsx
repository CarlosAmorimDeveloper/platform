import { useState } from 'react';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  name: string;
  options?: (string | SegmentOption)[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

function resolveOption(option: string | SegmentOption): SegmentOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function SegmentedControl({
  name,
  options = [],
  value,
  onChange,
  style,
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      style={{ display: 'inline-flex', border: '1px solid var(--color-divider)', ...style }}
    >
      {options.map((option, index) => {
        const opt = resolveOption(option);
        return (
          <SegmentItem
            key={opt.value}
            name={name}
            option={opt}
            checked={value === opt.value}
            onChange={onChange}
            withDivider={index > 0}
          />
        );
      })}
    </div>
  );
}

function SegmentItem({
  name,
  option,
  checked,
  onChange,
  withDivider,
}: {
  name: string;
  option: SegmentOption;
  checked: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  withDivider: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        minHeight: 'var(--control-h)',
        padding: '0 var(--space-4)',
        fontSize: 14,
        cursor: 'pointer',
        borderLeft: withDivider ? '1px solid var(--color-divider)' : undefined,
        background: checked
          ? 'var(--color-accent)'
          : hovered
            ? 'color-mix(in srgb, var(--color-text) 8%, transparent)'
            : 'transparent',
        color: checked ? 'var(--color-bg)' : 'inherit',
        outline: focused ? '2px solid var(--color-accent)' : 'none',
        outlineOffset: -2,
      }}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      {option.icon}
      {option.label}
    </label>
  );
}
