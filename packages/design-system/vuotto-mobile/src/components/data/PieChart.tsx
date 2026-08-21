import { useState } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { fontFamily, fontSize, fontWeight, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { defaultValueFormatter } from './chart-utils';

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

export function PieChart({
  slices,
  size = 200,
  valueFormatter = defaultValueFormatter,
  style,
}: PieChartProps) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let cumulativeFraction = 0;

  return (
    <View style={[{ gap: space[5] }, style]}>
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
                stroke={colors.lineHairline}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />
            ) : (
              slices.map((slice, i) => {
                const fraction = slice.value / total;
                const dashoffset = -cumulativeFraction * CIRCUMFERENCE;
                cumulativeFraction += fraction;
                const dimmed = activeIndex !== null && activeIndex !== i;
                return (
                  <Circle
                    key={slice.label}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    stroke={slice.color}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${fraction * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
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
              <View
                style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: slice.color }}
              />
              <Text
                style={{
                  flex: 1,
                  fontFamily: fontFamily.sans,
                  fontWeight: active ? fontWeight.semibold : fontWeight.medium,
                  fontSize: fontSize.sm,
                  color: colors.textPrimary,
                }}
              >
                {slice.label}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: fontSize.xs,
                  color: colors.textTertiary,
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
