// Resolved from tokens/spacing.css. Already unitless px — no conversion.
// The component layer renders every blueprint object at radius 0; these
// exist for the deliberate exception (see readme.md's "Do/Don't").
export const radii = {
  sm: 2,
  md: 4,
  lg: 7,
} as const;
