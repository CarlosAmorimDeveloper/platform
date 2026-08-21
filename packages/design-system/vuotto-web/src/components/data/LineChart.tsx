import { useState } from 'react';
import type { CSSProperties } from 'react';
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
  style?: CSSProperties;
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

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewX = ((e.clientX - rect.left) / rect.width) * VIEW_W;
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

  return (
    <div style={{ position: 'relative', ...style }}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
        role="img"
        aria-label="Gráfico de linhas"
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

        {data.map((d, i) => (
          <text
            key={i}
            x={xAt(i)}
            y={height - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={12}
            fill="var(--text-tertiary)"
          >
            {d.x}
          </text>
        ))}

        {hoverIndex !== null && (
          <line
            x1={xAt(hoverIndex)}
            y1={PAD.top}
            x2={xAt(hoverIndex)}
            y2={PAD.top + plotH}
            stroke="var(--line-strong)"
            strokeWidth={1}
          />
        )}

        {series.map((s, si) => {
          const { color, dashed } = seriesStyle(si);
          const points = data.map((d, i) => `${xAt(i)},${y(Number(d[s.key] ?? 0))}`).join(' ');
          return (
            <g key={s.key}>
              <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeDasharray={dashed ? '4 3' : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {hoverIndex !== null && (
                <circle
                  cx={xAt(hoverIndex)}
                  cy={y(Number(data[hoverIndex]?.[s.key] ?? 0))}
                  r={3}
                  fill={color}
                />
              )}
            </g>
          );
        })}
      </svg>

      {hoverIndex !== null && data[hoverIndex] && (
        <ChartTooltip leftPct={(xAt(hoverIndex) / VIEW_W) * 100} topPct={(PAD.top / height) * 100}>
          <div
            style={{
              font: 'var(--weight-medium) var(--text-xs)/1.6 var(--font-mono)',
              color: 'var(--text-tertiary)',
            }}
          >
            {data[hoverIndex].x}
          </div>
          {series.map((s, si) => (
            <div
              key={s.key}
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
                  background: seriesStyle(si).color,
                }}
              />
              {s.label}: {valueFormatter(Number(data[hoverIndex]?.[s.key] ?? 0))}
            </div>
          ))}
        </ChartTooltip>
      )}
    </div>
  );
}
