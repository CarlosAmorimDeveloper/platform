import type { ReactNode } from 'react';

export interface ChartTooltipProps {
  /** Position as a percentage of the chart's viewBox, so it tracks the SVG's responsive scaling without pixel math. */
  leftPct: number;
  topPct: number;
  children: ReactNode;
}

/**
 * REB-26 AC: "Tooltip reaproveita a superfície de Tooltip" — the standalone
 * `Tooltip` component doesn't exist yet (it belongs to the not-yet-built
 * Feedback epic, REB-6), so this reuses the same glass-panel tokens `Card`
 * is already built from (`surface-card`, `line-hairline`, `shadow-inset-top`,
 * `glass-blur`) rather than depending on a component that isn't there.
 */
export function ChartTooltip({ leftPct, topPct, children }: ChartTooltipProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: 'translate(-50%, -100%) translateY(-8px)',
        pointerEvents: 'none',
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-card)',
        border: '1px solid var(--line-hairline)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-md)',
        whiteSpace: 'nowrap',
        zIndex: 2,
      }}
    >
      {children}
    </div>
  );
}
