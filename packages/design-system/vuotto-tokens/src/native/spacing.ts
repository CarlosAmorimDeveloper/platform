// Resolved from tokens/spacing.css. Already unitless px in the source —
// no conversion needed, RN consumes these numbers directly.
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// `gutterDesktop`, `measureProse`, `containerMax` and `sectionY` are web-only
// (fluid layout / prose-width concepts with no RN equivalent) and are
// deliberately not ported here.
export const layout = {
  gutterMobile: 20,
  touchMin: 44,
} as const;

export const controlHeight = {
  sm: 32,
  md: 40,
  lg: 48,
} as const;
