import type { HTMLAttributes, CSSProperties } from 'react';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  width?: string | number;
  height?: string | number;
  radius?: string;
  /** Multiple stacked bars; the last is shortened. */
  lines?: number;
  style?: CSSProperties;
}

export function Skeleton({
  width = '100%',
  height = 12,
  radius = 'var(--radius-xs)',
  lines = 1,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} {...rest}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className="vt-skeleton-bar"
          style={{
            display: 'block',
            width: lines > 1 && i === lines - 1 ? '62%' : width,
            height,
            borderRadius: radius,
          }}
        />
      ))}
    </span>
  );
}
