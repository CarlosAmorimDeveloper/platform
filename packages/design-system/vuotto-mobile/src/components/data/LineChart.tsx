import { useState } from 'react';
import {
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { fontFamily, fontSize } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { ChartTooltip } from './ChartTooltip';
import { defaultValueFormatter, scaleLinear, seriesStyle } from './chart-utils';

export interface ChartSeries {
  key: string;
  label: string;
}

export type ChartDatum = { x: string | number } & Record<string, string | number>;

export interface LineChartProps {
  data: ChartDatum[];
  series: ChartSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

const VIEW_W = 560;
const PAD = { top: 12, right: 12, bottom: 24, left: 40 };

export function LineChart({
  data,
  series,
  height = 220,
  valueFormatter = defaultValueFormatter,
  style,
}: LineChartProps) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(VIEW_W);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const values = data.flatMap((d) => series.map((s) => Number(d[s.key] ?? 0)));
  const yMin = Math.min(0, ...values);
  const yMax = Math.max(1, ...values);
  const y = scaleLinear([yMin, yMax], [PAD.top + plotH, PAD.top]);

  const xStep = data.length > 1 ? plotW / (data.length - 1) : 0;
  const xAt = (i: number) => PAD.left + (data.length > 1 ? i * xStep : plotW / 2);

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  function updateHoverFromTouch(e: GestureResponderEvent) {
    const viewX = (e.nativeEvent.locationX / containerWidth) * VIEW_W;
    let nearest = 0;
    let nearestDist = Infinity;
    data.forEach((_, i) => {
      const dist = Math.abs(xAt(i) - viewX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  const hovered = hoverIndex !== null ? data[hoverIndex] : undefined;

  return (
    <View style={style}>
      <View
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={updateHoverFromTouch}
        onResponderMove={updateHoverFromTouch}
        onResponderRelease={() => setHoverIndex(null)}
        style={{ position: 'relative' }}
      >
        <Svg
          viewBox={`0 0 ${VIEW_W} ${height}`}
          width="100%"
          height={height}
          accessibilityLabel="Gráfico de linhas"
        >
          {yTicks.map((tick, i) => (
            <Line
              key={`grid-${i}`}
              x1={PAD.left}
              y1={y(tick)}
              x2={VIEW_W - PAD.right}
              y2={y(tick)}
              stroke={colors.lineHairline}
              strokeWidth={1}
            />
          ))}
          {yTicks.map((tick, i) => (
            <SvgText
              key={`ytick-${i}`}
              x={PAD.left - 8}
              y={y(tick)}
              textAnchor="end"
              fontFamily={fontFamily.mono}
              fontSize={12}
              fill={colors.textTertiary}
            >
              {valueFormatter(tick)}
            </SvgText>
          ))}

          {data.map((d, i) => (
            <SvgText
              key={`xtick-${i}`}
              x={xAt(i)}
              y={height - 6}
              textAnchor="middle"
              fontFamily={fontFamily.mono}
              fontSize={12}
              fill={colors.textTertiary}
            >
              {String(d.x)}
            </SvgText>
          ))}

          {hoverIndex !== null && (
            <Line
              x1={xAt(hoverIndex)}
              y1={PAD.top}
              x2={xAt(hoverIndex)}
              y2={PAD.top + plotH}
              stroke={colors.lineStrong}
              strokeWidth={1}
            />
          )}

          {series.map((s, si) => {
            const { color, dashed } = seriesStyle(si);
            const points = data.map((d, i) => `${xAt(i)},${y(Number(d[s.key] ?? 0))}`).join(' ');
            return (
              <Polyline
                key={s.key}
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
          {hoverIndex !== null &&
            series.map((s, si) => (
              <Circle
                key={s.key}
                cx={xAt(hoverIndex)}
                cy={y(Number(data[hoverIndex]?.[s.key] ?? 0))}
                r={3}
                fill={seriesStyle(si).color}
              />
            ))}
        </Svg>

        {hovered && (
          <ChartTooltip
            leftPct={(xAt(hoverIndex!) / VIEW_W) * 100}
            topPct={(PAD.top / height) * 100}
            containerWidth={containerWidth}
            containerHeight={height}
          >
            <Text
              style={{
                fontFamily: fontFamily.mono,
                fontSize: fontSize.xs,
                color: colors.textTertiary,
              }}
            >
              {String(hovered.x)}
            </Text>
            {series.map((s, si) => (
              <View key={s.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: seriesStyle(si).color,
                  }}
                />
                <Text style={{ fontSize: fontSize.sm, color: colors.textPrimary }}>
                  {s.label}: {valueFormatter(Number(hovered[s.key] ?? 0))}
                </Text>
              </View>
            ))}
          </ChartTooltip>
        )}
      </View>
    </View>
  );
}
