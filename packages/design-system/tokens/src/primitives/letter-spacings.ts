// Ratios relative to font-size (em-equivalent). Web resolves them with
// `platform/web.ts#em`; React Native has no em unit, so
// `platform/native.ts#resolveLetterSpacing` multiplies by a fontSize step.
export const letterSpacings = {
  tight: -0.02,
  normal: 0,
  wide: 0.02,
  wider: 0.04,
} as const;

export type LetterSpacings = typeof letterSpacings;
