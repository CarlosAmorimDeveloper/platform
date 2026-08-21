// RN has no unitless line-height or em-based letter-spacing like CSS —
// both are absolute px numbers. The shared token stays the ratio
// (`lineHeight.normal`, `letterSpacing.label`, ...); these resolve it
// against whichever fontSize step the caller is using.
export function resolveLineHeight(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio);
}

export function resolveLetterSpacing(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio * 100) / 100;
}
