// Resolved from tokens/spacing.css. Already unitless px in the source — no
// conversion needed, RN consumes these numbers directly.
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

export const control = {
  height: 44,
  heightSm: 36,
  tap: 44,
} as const;

// `--safe-b` / `--safe-t` (`env(safe-area-inset-*)`) are a web/CSS concept —
// RN apps get the same insets from `react-native-safe-area-context`'s
// `useSafeAreaInsets()` (already the pattern in this repo's mobile apps),
// not from a static token, so they're deliberately not ported here.
