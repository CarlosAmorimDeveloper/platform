import { useState } from 'react';
import type { HTMLAttributes, CSSProperties, ReactNode } from 'react';

const PADS = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-8)' };
const RADII = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
};

export type CardPadding = keyof typeof PADS;
export type CardRadius = keyof typeof RADII;
export type CardGlow = 'cool' | 'violet' | null;

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  padding?: CardPadding;
  radius?: CardRadius;
  /** Adds --shadow-md. Only for surfaces that genuinely float. */
  elevated?: boolean;
  /** Enables hover lift + pointer cursor. */
  interactive?: boolean;
  selected?: boolean;
  /** Atmospheric radial tint behind the content. */
  glow?: CardGlow;
  style?: CSSProperties;
}

export function Card({
  children,
  padding = 'md',
  radius = 'md',
  elevated = false,
  interactive = false,
  selected = false,
  glow = null,
  style,
  ...rest
}: CardProps) {
  const [hovered, setHovered] = useState(false);
  const raised = selected || (interactive && hovered);

  return (
    <div
      data-vt-glass
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
      style={{
        position: 'relative',
        padding: PADS[padding],
        borderRadius: RADII[radius],
        background: selected ? 'var(--glass-3)' : raised ? 'var(--glass-2)' : 'var(--surface-card)',
        border: `1px solid ${raised ? 'var(--line-strong)' : 'var(--line-hairline)'}`,
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: elevated
          ? 'var(--shadow-inset-top), var(--shadow-md)'
          : 'var(--shadow-inset-top)',
        backgroundImage:
          glow === 'cool' ? 'var(--glow-cool)' : glow === 'violet' ? 'var(--glow-violet)' : 'none',
        transition:
          'background var(--motion-hover), border-color var(--motion-hover), transform var(--dur-fast) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
