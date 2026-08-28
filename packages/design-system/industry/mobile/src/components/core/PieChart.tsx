import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { alpha, color, fontFamily, fontFamilyMono, fontWeight, space } from '@industry/tokens';

const monoFontFamily = Platform.select(fontFamilyMono);

export interface PieChartSlice {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  slices: PieChartSlice[];
  size?: number;
  valueFormatter?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

const VIEW = 200;
const CENTER = VIEW / 2;
const RADIUS = 70;
const STROKE_WIDTH = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const defaultValueFormatter = (value: number): string =>
  new Intl.NumberFormat('pt-BR').format(value);

/** Renders each slice's stroke-dasharray offset from the running total so far. */
export function resolveSliceDash(
  slices: readonly { value: number }[],
  index: number,
  total: number,
): { dasharray: string; dashoffset: number } {
  const cumulative = slices.slice(0, index).reduce((sum, s) => sum + s.value, 0);
  const fraction = total === 0 ? 0 : slices[index]!.value / total;
  const cumulativeFraction = total === 0 ? 0 : cumulative / total;
  return {
    dasharray: `${fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`,
    dashoffset: -cumulativeFraction * CIRCUMFERENCE,
  };
}

/** Donut chart with a tap-to-highlight legend. Colors come from the `--viz-*` tokens. */
export function PieChart({
  slices,
  size = 200,
  valueFormatter = defaultValueFormatter,
  style,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = slices.reduce((sum, s) => sum + s.value, 0);

  return (
    <View style={[{ gap: space[6] }, style]}>
      <View style={{ alignSelf: 'center' }}>
        <Svg
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          width={size}
          height={size}
          accessibilityLabel="Gráfico de pizza"
        >
          <G rotation={-90} originX={CENTER} originY={CENTER}>
            {total === 0 ? (
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke={color.divider}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
            ) : (
              slices.map((slice, i) => {
                const { dasharray, dashoffset } = resolveSliceDash(slices, i, total);
                const dimmed = activeIndex !== null && activeIndex !== i;
                return (
                  <Circle
                    key={slice.label}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={slice.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={dasharray}
                    strokeDashoffset={dashoffset}
                    strokeOpacity={dimmed ? 0.35 : 1}
                    fill="none"
                  />
                );
              })
            )}
          </G>
        </Svg>
      </View>

      <View style={{ gap: space[2] }}>
        {slices.map((slice, i) => {
          const pct = total === 0 ? 0 : Math.round((slice.value / total) * 100);
          const active = activeIndex === i;
          return (
            <Pressable
              key={slice.label}
              accessibilityRole="button"
              accessibilityLabel={`${slice.label}: ${valueFormatter(slice.value)}, ${pct}%`}
              onPress={() => setActiveIndex(active ? null : i)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: space[2],
                opacity: activeIndex !== null && !active ? 0.5 : 1,
              }}
            >
              <View style={{ width: 10, height: 10, backgroundColor: slice.color }} />
              <Text
                style={{
                  flex: 1,
                  fontFamily: fontFamily.body,
                  fontWeight: active ? fontWeight.heading : fontWeight.body,
                  fontSize: 13,
                  color: color.text,
                }}
              >
                {slice.label}
              </Text>
              <Text
                style={{
                  fontFamily: monoFontFamily,
                  fontSize: 12,
                  color: alpha(color.text, 50),
                }}
              >
                {valueFormatter(slice.value)} · {pct}%
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
