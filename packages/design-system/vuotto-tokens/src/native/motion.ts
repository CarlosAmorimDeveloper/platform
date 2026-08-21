// Resolved from tokens/effects.css. Bezier control points are portable as-is
// — RN's `Easing.bezier(x1, y1, x2, y2)` (and Reanimated's `Easing.bezier`)
// take the same four numbers as CSS `cubic-bezier()`.
export const easing = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  fast: 120,
  base: 200,
  slow: 420,
} as const;
