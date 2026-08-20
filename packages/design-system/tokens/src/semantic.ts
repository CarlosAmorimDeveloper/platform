import { colors, radii } from './primitives';

// Resolved from the POR-74/POR-75 web↔mobile audit. Roles not yet covered
// there (surfaceRaised, surfaceSunken, borderStrong, borderFocus, textDisabled,
// accentHover, accentPressed, elevation, etc.) are still open and land with
// their owning tickets (POR-78/79/80/81) instead of being guessed here.
export const semanticColors = {
  surface: colors.neutral[0],
  background: colors.neutral[50],
  textPrimary: colors.neutral[900],
  textSecondary: colors.neutral[600],
  textOnAccent: colors.neutral[0],
  border: colors.neutral[200],
  accent: colors.primary[600],
  error: colors.error[500],
} as const;

export type SemanticColors = typeof semanticColors;

export const semanticRadii = {
  radiusBase: radii.md,
} as const;

export type SemanticRadii = typeof semanticRadii;
