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
