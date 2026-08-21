import type { CSSProperties } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;

export interface IconProps {
  /** Lucide icon name, kebab-case (e.g. "arrow-right", "list-checks"). */
  name: string;
  /** xs=14 sm=16 md=20 lg=24, or an explicit px number. */
  size?: IconSize;
  /** Defaults to currentColor. Use var(--text-tertiary) for decorative glyphs. */
  color?: string;
  /** Defaults to 1.5 (2 at 14px). Never heavier than 2. */
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  /**
   * Only pass this when the icon alone conveys meaning (e.g. inside an
   * icon-only button) — it flips the icon out of its decorative default.
   * Without it, the icon renders `aria-hidden`.
   */
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 'sm',
  color = 'currentColor',
  strokeWidth,
  className,
  style,
  'aria-label': ariaLabel,
}: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const resolvedStrokeWidth = strokeWidth ?? (px <= 14 ? 2 : 1.5);

  return (
    <DynamicIcon
      // The public prop stays `string` (matching the original wrapper's
      // contract) so an unrecognized name is a runtime 404 on the chunk,
      // not a type error — same failure mode the CDN version had.
      name={name as IconName}
      size={px}
      color={color}
      strokeWidth={resolvedStrokeWidth}
      className={className}
      style={style}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
