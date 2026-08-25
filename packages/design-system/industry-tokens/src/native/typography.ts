// Resolved from tokens/typography.css. Fixed px per level (Industry has no
// fluid/clamp() scale) — same numbers a browser resolves the CSS to.
export const fontSize = {
  h1: 46,
  h2: 34,
  h3: 26,
  h4: 21,
  h5: 17,
  h6: 13,
  body: 16,
} as const;

export const fontWeight = {
  heading: '600',
  body: '400',
} as const;

export const lineHeight = {
  heading: 1.12,
  body: 1.55,
} as const;

export const letterSpacing = {
  heading: -0.015,
  h6: 0.08,
} as const;

// RN takes one family name per weight/style combo, no CSS fallback stack —
// these only resolve if the app links the matching font file natively.
export const fontFamily = {
  heading: 'Barlow Condensed',
  body: 'Barlow',
} as const;

// `--font-mono` is a system stack (`ui-monospace, 'SF Mono', Menlo, monospace`),
// not a custom font requiring linking — RN has no single name equivalent to a
// CSS fallback list, so this exports the platform-native monospace name for
// the caller to select with `Platform.OS`.
export const fontFamilyMono = {
  ios: 'Menlo',
  android: 'monospace',
} as const;
