// GENERATED FILE — do not edit by hand.
// Resolved from tokens/colors.css by scripts/build-native-tokens.mjs.
// Re-run `yarn build` after changing colors.css to regenerate this file.

export const vtColors = {
  black: '#060709',
  ink0: '#0b0e11',
  ink1: '#13161a',
  ink2: '#1f2225',
  ink3: '#35383c',
  ink4: '#5a5e62',
  mute: '#8c8f93',
  soft: '#bcbec0',
  white: '#e6e6e6',
  pure: '#ffffff',
  cool: '#88cada',
  violet: '#c4b4e5',
  success: '#6ecf9a',
  warning: '#eec066',
  danger: '#ea6a6a',
} as const;

export const semanticColors = {
  dark: {
    accent: '#e6e6e6',
    info: '#88cada',
    bgCanvas: '#060709',
    bgElevated: '#0b0e11',
    bgSunken: '#030506',
    glass1: 'rgba(255, 255, 255, 0.05)',
    glass2: 'rgba(255, 255, 255, 0.08)',
    glass3: 'rgba(255, 255, 255, 0.12)',
    glassScrim: 'rgba(6, 7, 9, 0.60)',
    lineHairline: 'rgba(255, 255, 255, 0.09)',
    lineStrong: 'rgba(255, 255, 255, 0.18)',
    lineFocus: 'rgba(230, 230, 230, 0.55)',
    textPrimary: '#bcbec0',
    textHeading: '#e6e6e6',
    textSecondary: '#8c8f93',
    textTertiary: '#5a5e62',
    textInverse: '#060709',
    textLink: '#88cada',
    surfaceCard: 'rgba(255, 255, 255, 0.05)',
    surfaceRaised: 'rgba(255, 255, 255, 0.08)',
    surfaceInput: 'rgba(255, 255, 255, 0.04)',
    surfaceSolid: '#13161a',
  },
  light: {
    accent: '#e6e6e6',
    info: '#88cada',
    bgCanvas: '#f6f7f8',
    bgElevated: '#fdfdfe',
    bgSunken: '#ebedef',
    glass1: 'rgba(255, 255, 255, 0.66)',
    glass2: 'rgba(255, 255, 255, 0.82)',
    glass3: 'rgba(255, 255, 255, 0.92)',
    glassScrim: 'rgba(255, 255, 255, 0.65)',
    lineHairline: 'rgba(6, 7, 9, 0.10)',
    lineStrong: 'rgba(6, 7, 9, 0.20)',
    lineFocus: 'rgba(6, 7, 9, 0.45)',
    textPrimary: '#13161a',
    textHeading: '#060709',
    textSecondary: '#35383c',
    textTertiary: '#5a5e62',
    textInverse: '#e6e6e6',
    textLink: '#88cada',
    surfaceCard: 'rgba(255, 255, 255, 0.66)',
    surfaceRaised: 'rgba(255, 255, 255, 0.82)',
    surfaceInput: 'rgba(255, 255, 255, 0.70)',
    surfaceSolid: '#ffffff',
  },
} as const;

export type ThemeMode = keyof typeof semanticColors;
export type SemanticColors = (typeof semanticColors)[ThemeMode];

// Same source color the web adapter's boxShadow() resolves against
// (tokens/effects.css's --shadow-* all mix from --vt-black).
export const shadowColor = '#060709';
