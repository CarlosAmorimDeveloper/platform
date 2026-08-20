import type { ElevationLevel } from '../semantic';

export function px(value: number): string {
  return `${value}px`;
}

export function rem(value: number, base = 16): string {
  return `${value / base}rem`;
}

export function em(value: number): string {
  return `${value}em`;
}

// Fluid type sizing between two viewport widths, per POR-79: the shared
// token is still the fontSize step passed in as `min`/`max` — this only
// interpolates between two of those steps, it doesn't invent new sizes.
export function fluidFontSize(
  min: number,
  max: number,
  minViewport = 320,
  maxViewport = 1280,
): string {
  const slope = (max - min) / (maxViewport - minViewport);
  const yIntercept = min - slope * minViewport;
  const preferred = `${yIntercept.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw`;
  return `clamp(${px(min)}, calc(${preferred}), ${px(max)})`;
}

const ELEVATION_SHADOW_PARAMS: Record<
  Exclude<ElevationLevel, 0>,
  { offsetY: number; blur: number; opacity: number }
> = {
  1: { offsetY: 1, blur: 3, opacity: 0.08 },
  2: { offsetY: 2, blur: 6, opacity: 0.12 },
  3: { offsetY: 4, blur: 12, opacity: 0.16 },
};

// Resolves an abstract elevation level (POR-80) to a CSS box-shadow using
// `colors.neutral[1000]` as the shadow color — same source color the mobile
// adapter uses for `shadowColor`, so both platforms cast the same "ink".
export function boxShadow(level: ElevationLevel): string {
  if (level === 0) return 'none';
  const { offsetY, blur, opacity } = ELEVATION_SHADOW_PARAMS[level];
  return `0 ${px(offsetY)} ${px(blur)} rgba(0, 0, 0, ${opacity})`;
}
