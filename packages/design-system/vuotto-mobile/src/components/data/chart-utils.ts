import { vtColors } from '@vuotto/tokens';

/**
 * REB-26 acceptance criteria caps the series palette at 4 colours before it
 * repeats ("no máximo 4 séries antes de repetir com padrão") — `danger` is
 * deliberately excluded since that colour means "error" everywhere else in
 * the system, so a 5th series would misread as a failure state.
 */
const SERIES_COLORS = [vtColors.cool, vtColors.violet, vtColors.success, vtColors.warning] as const;

export interface SeriesStyle {
  color: string;
  /** A repeated colour (5th+ series) switches to a dashed stroke/hatch instead of introducing a 5th hue. */
  dashed: boolean;
}

export function seriesStyle(index: number): SeriesStyle {
  return {
    color: SERIES_COLORS[index % SERIES_COLORS.length]!,
    dashed: index >= SERIES_COLORS.length,
  };
}

export function scaleLinear(domain: readonly [number, number], range: readonly [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  return (value: number) => (span === 0 ? (r0 + r1) / 2 : r0 + ((value - d0) / span) * (r1 - r0));
}

export const defaultValueFormatter = (value: number): string =>
  new Intl.NumberFormat('pt-BR').format(value);
