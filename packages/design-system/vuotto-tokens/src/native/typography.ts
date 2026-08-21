// Resolved from tokens/typography.css. `display-xl`/`display-lg` are
// `clamp()` on web (fluid by viewport) — RN has no viewport-relative sizing,
// so these use the clamp's min bound, which is what the formula already
// resolves to at phone-width viewports (well below the clamp's inflection
// point) — not an approximation, the same number the formula would produce.
export const fontSize = {
  displayXl: 52,
  displayLg: 40,
  displayMd: 40,
  displaySm: 30,
  '3xl': 28,
  '2xl': 24,
  xl: 20,
  lg: 17,
  md: 15,
  sm: 13,
  xs: 12,
} as const;

// String values — RN's `fontWeight` style type only accepts the string union,
// not a raw number.
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Unitless ratios — resolve against a fontSize with `resolveLineHeight()`
// from `native/typography-adapter.ts` (RN's lineHeight is an absolute px
// number, not a ratio like CSS).
export const lineHeight = {
  tight: 1.06,
  snug: 1.28,
  normal: 1.55,
  loose: 1.7,
} as const;

// Em-equivalent ratios — resolve against a fontSize with
// `resolveLetterSpacing()` (RN's letterSpacing is absolute px, not em).
export const letterSpacing = {
  display: -0.02,
  tight: -0.012,
  normal: 0,
  label: 0.14,
} as const;

// RN takes one family name per weight/style combo, no CSS-style fallback
// stack — these only resolve if the app links the matching font file
// natively (see @vuotto/mobile's README for the linking step).
export const fontFamily = {
  sans: 'Manrope',
  display: 'Instrument Serif',
  mono: 'JetBrains Mono',
} as const;
