// Resolved from tokens/effects.css. Direct numbers — RN's `zIndex` style
// takes the same kind of plain integer as CSS `z-index`.
export const zIndex = {
  base: 0,
  sticky: 10,
  overlay: 100,
  modal: 200,
  toast: 300,
} as const;
