export function resolveLineHeight(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio);
}

export function resolveLetterSpacing(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio * 100) / 100;
}
