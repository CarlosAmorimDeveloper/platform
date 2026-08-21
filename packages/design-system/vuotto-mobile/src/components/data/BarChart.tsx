import { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { fontFamily, fontSize } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { ChartTooltip } from './ChartTooltip';
import type { ChartDatum, ChartSeries } from './LineChart';
import { defaultValueFormatter, scaleLinear, seriesStyle } from './chart-utils';

export interface BarChartProps {
  data: ChartDatum[];
  series: ChartSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
}

const VIEW_W = 560;
const PAD = { top: 12, right: 12, bottom: 24, left: 40 };
const BAND_GAP = 0.3;
const BAR_GAP = 2;

export function BarChart({
  data,
  series,
  height = 220,
  valueFormatter = defaultValueFormatter,
  style,
}: BarChartProps) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState(VIEW_W);
  const [hover, setHover] = useState<{ dataIndex: number; seriesIndex: number } | null>(null);

  const plotW = VIEW_W - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const values = data.flatMap((d) => series.map((s) => Number(d[s.key] ?? 0)));
  const yMin = Math.min(0, ...values);
  const yMax = Math.max(1, ...values);
  const y = scaleLinear([yMin, yMax], [PAD.top + plotH, PAD.top]);
  const yZero = y(0);

  const bandWidth = plotW / Math.max(1, data.length);
  const barGroupWidth = bandWidth * (1 - BAND_GAP);
  const barWidth = (barGroupWidth - BAR_GAP * (series.length - 1)) / series.length;

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  const hoveredDatum = hover ? data[hover.dataIndex] : undefined;
  const hoveredSeries = hover ? series[hover.seriesIndex] : undefined;

  return (
    <View style={style}>
      <View onLayout={handleLayout} style={{ position: 'relative' }}>
        <Svg
          viewBox={`0 0 ${VIEW_W} ${height}`}
          width="100%"
          height={height}
          accessibilityLabel="Gráfico de barras"
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

          {data.map((d, di) => {
            return (
              <SvgText
                key={`xtick-${di}`}
                x={PAD.left + di * bandWidth + bandWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fontFamily={fontFamily.mono}
                fontSize={12}
                fill={colors.textTertiary}
              >
                {String(d.x)}
              </SvgText>
            );
          })}

          {data.map((d, di) => {
            const bandStart = PAD.left + di * bandWidth + (bandWidth - barGroupWidth) / 2;
            return series.map((s, si) => {
              const value = Number(d[s.key] ?? 0);
              const { color, dashed } = seriesStyle(si);
              const barX = bandStart + si * (barWidth + BAR_GAP);
              const barY = Math.min(y(value), yZero);
              const barH = Math.abs(y(value) - yZero);
              return (
                <Rect
                  key={s.key}
                  x={barX}
                  y={barY}
                  width={Math.max(0, barWidth)}
                  height={Math.max(0, barH)}
                  fill={color}
                  opacity={dashed ? 0.6 : 1}
                  rx={2}
                />
              );
            });
          })}
        </Svg>

        <View style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}>
          {data.map((d, di) => (
            <View
              key={di}
              style={{
                flexDirection: 'row',
                width: `${(1 / data.length) * 100}%`,
                justifyContent: 'center',
                gap: (BAR_GAP / VIEW_W) * containerWidth,
              }}
            >
              {series.map((s, si) => (
                <Pressable
                  key={s.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${s.label}, ${String(d.x)}: ${valueFormatter(Number(d[s.key] ?? 0))}`}
                  onPress={() =>
                    setHover(
                      hover?.dataIndex === di && hover.seriesIndex === si
                        ? null
                        : { dataIndex: di, seriesIndex: si },
                    )
                  }
                  style={{ width: (barWidth / VIEW_W) * containerWidth, height: '100%' }}
                />
              ))}
            </View>
          ))}
        </View>

        {hoveredDatum && hoveredSeries && hover && (
          <ChartTooltip
            leftPct={
              ((PAD.left +
                hover.dataIndex * bandWidth +
                (bandWidth - barGroupWidth) / 2 +
                hover.seriesIndex * (barWidth + BAR_GAP) +
                barWidth / 2) /
                VIEW_W) *
              100
            }
            topPct={(y(Number(hoveredDatum[hoveredSeries.key] ?? 0)) / height) * 100}
            containerWidth={containerWidth}
            containerHeight={height}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: seriesStyle(hover.seriesIndex).color,
                }}
              />
              <Text style={{ fontSize: fontSize.sm, color: colors.textPrimary }}>
                {hoveredSeries.label} · {String(hoveredDatum.x)}:{' '}
                {valueFormatter(Number(hoveredDatum[hoveredSeries.key] ?? 0))}
              </Text>
            </View>
          </ChartTooltip>
        )}
      </View>
    </View>
  );
}
