import { useState } from 'react';
import type { CSSProperties } from 'react';
import { ChartTooltip } from './ChartTooltip';
import type { ChartDatum, ChartSeries } from './LineChart';
import { defaultValueFormatter, scaleLinear, seriesStyle } from './chart-utils';

export interface BarChartProps {
  data: ChartDatum[];
  series: ChartSeries[];
  height?: number;
  valueFormatter?: (value: number) => string;
  style?: CSSProperties;
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

  return (
    <div style={{ position: 'relative', ...style }}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de barras"
      >
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={y(tick)}
              x2={VIEW_W - PAD.right}
              y2={y(tick)}
              stroke="var(--line-hairline)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={12}
              fill="var(--text-tertiary)"
            >
              {valueFormatter(tick)}
            </text>
          </g>
        ))}

        {data.map((d, di) => {
          const bandStart = PAD.left + di * bandWidth + (bandWidth - barGroupWidth) / 2;
          return (
            <g key={di}>
              <text
                x={PAD.left + di * bandWidth + bandWidth / 2}
                y={height - 6}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={12}
                fill="var(--text-tertiary)"
              >
                {d.x}
              </text>
              {series.map((s, si) => {
                const value = Number(d[s.key] ?? 0);
                const { color, dashed } = seriesStyle(si);
                const barX = bandStart + si * (barWidth + BAR_GAP);
                const barY = Math.min(y(value), yZero);
                const barH = Math.abs(y(value) - yZero);
                const isHovered = hover?.dataIndex === di && hover.seriesIndex === si;
                return (
                  <rect
                    key={s.key}
                    x={barX}
                    y={barY}
                    width={Math.max(0, barWidth)}
                    height={Math.max(0, barH)}
                    fill={color}
                    opacity={dashed ? 0.6 : 1}
                    rx={2}
                    onMouseEnter={() => setHover({ dataIndex: di, seriesIndex: si })}
                    onMouseLeave={() => setHover(null)}
                    style={{ outline: isHovered ? '1px solid var(--line-strong)' : 'none' }}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {hover &&
        (() => {
          const d = data[hover.dataIndex];
          const s = series[hover.seriesIndex];
          if (!d || !s) return null;
          const bandStart =
            PAD.left + hover.dataIndex * bandWidth + (bandWidth - barGroupWidth) / 2;
          const barCenterX = bandStart + hover.seriesIndex * (barWidth + BAR_GAP) + barWidth / 2;
          const value = Number(d[s.key] ?? 0);
          return (
            <ChartTooltip leftPct={(barCenterX / VIEW_W) * 100} topPct={(y(value) / height) * 100}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  font: 'var(--weight-regular) var(--text-sm)/1.6 var(--font-sans)',
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: seriesStyle(hover.seriesIndex).color,
                  }}
                />
                {s.label} · {d.x}: {valueFormatter(value)}
              </div>
            </ChartTooltip>
          );
        })()}
    </div>
  );
}
