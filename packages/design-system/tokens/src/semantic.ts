import { colors, radii } from './primitives';

// Resolved from the POR-74/POR-75 web↔mobile audit (surface, background,
// textPrimary/Secondary/OnAccent, border, accent, error) plus the POR-78
// color palette pass below. `background` already covers the "surfaceSunken"
// role by another name — the DS calls it `background` in both platforms'
// existing vocabulary (MUI's `background.default`, Paper's `background`), so
// no second name was added for the same value.
export const semanticColors = {
  surface: colors.neutral[0],
  // Light theme: a genuinely "raised" surface color would just be another
  // guess with no evidence behind it — elevation here is expressed through
  // the `elevation` levels below (box-shadow / RN elevation), not a fill
  // color, so this deliberately equals `surface`.
  surfaceRaised: colors.neutral[0],
  background: colors.neutral[50],
  textPrimary: colors.neutral[900],
  textSecondary: colors.neutral[600],
  textDisabled: colors.neutral[400],
  textOnAccent: colors.neutral[0],
  border: colors.neutral[200],
  borderStrong: colors.neutral[300],
  borderFocus: colors.primary[600],
  accent: colors.primary[600],
  accentHover: colors.primary[700],
  // The gap the epic called out by name: mobile has no hover, so the
  // pressed/touch state needs its own token instead of reusing hover's.
  accentPressed: colors.primary[800],
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
} as const;

export type SemanticColors = typeof semanticColors;

export const semanticRadii = {
  radiusBase: radii.md,
} as const;

export type SemanticRadii = typeof semanticRadii;
