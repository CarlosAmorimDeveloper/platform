import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import type { ReactNode } from 'react';
import { radii, shadow } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface ChartTooltipProps {
  /** Position as a percentage of the chart's viewBox, so it tracks the SVG's responsive scaling without pixel math. */
  leftPct: number;
  topPct: number;
  containerWidth: number;
  containerHeight: number;
  children: ReactNode;
}

/**
 * REB-26 AC: "Tooltip reaproveita a superfície de Tooltip" — the standalone
 * `Tooltip` component doesn't exist yet (it belongs to the not-yet-built
 * Feedback epic, REB-6), so this reuses the same glass-panel tokens `Card`
 * is already built from (`surfaceCard`, `lineHairline`, `shadow.md`) rather
 * than depending on a component that isn't there.
 *
 * RN transforms have no CSS `translate(-50%, -100%)` percentage-of-self
 * equivalent — centering requires measuring the tooltip's own rendered size
 * first (`onLayout`) and offsetting by that, hence the two-pass render.
 */
export function ChartTooltip({
  leftPct,
  topPct,
  containerWidth,
  containerHeight,
  children,
}: ChartTooltipProps) {
  const { colors } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });

  function handleLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.width || height !== size.height) setSize({ width, height });
  }

  const left = (leftPct / 100) * containerWidth - size.width / 2;
  const top = (topPct / 100) * containerHeight - size.height - 8;

  return (
    <View
      onLayout={handleLayout}
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: radii.sm,
        backgroundColor: colors.surfaceCard,
        borderWidth: 1,
        borderColor: colors.lineHairline,
        opacity: size.width === 0 ? 0 : 1,
        ...shadow.md,
      }}
    >
      {children}
    </View>
  );
}
