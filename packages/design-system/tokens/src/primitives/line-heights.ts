// Unitless ratios (relative to font-size), matching how CSS `line-height`
// already works without a unit. React Native has no unitless line-height —
// multiply by a fontSize step first, see `platform/native.ts#resolveLineHeight`.
export const lineHeights = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export type LineHeights = typeof lineHeights;
