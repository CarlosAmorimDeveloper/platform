import { MD3LightTheme } from 'react-native-paper';
import { colors, semanticColors, semanticRadii } from '@ds/tokens';

export const theme = {
  ...MD3LightTheme,
  roundness: semanticRadii.radiusBase,
  colors: {
    ...MD3LightTheme.colors,
    primary: semanticColors.accent,
    onPrimary: semanticColors.textOnAccent,
    primaryContainer: colors.primary[100],
    onPrimaryContainer: colors.primary[900],
    secondary: colors.primary[400],
    onSecondary: semanticColors.textOnAccent,
    secondaryContainer: colors.primary[100],
    onSecondaryContainer: colors.primary[900],
    tertiary: semanticColors.accent,
    onTertiary: semanticColors.textOnAccent,
    tertiaryContainer: colors.primary[100],
    onTertiaryContainer: colors.primary[900],
    error: semanticColors.error,
    onError: semanticColors.textOnAccent,
    background: semanticColors.background,
    onBackground: semanticColors.textPrimary,
    surface: semanticColors.surface,
    onSurface: semanticColors.textPrimary,
    surfaceVariant: colors.neutral[100],
    onSurfaceVariant: semanticColors.textSecondary,
    surfaceDisabled: colors.neutral[200],
    onSurfaceDisabled: colors.neutral[400],
    outline: colors.neutral[300],
    outlineVariant: semanticColors.border,
    inverseSurface: colors.neutral[800],
    inverseOnSurface: colors.neutral[50],
    inversePrimary: colors.primary[300],
    backdrop: 'rgba(17, 24, 39, 0.4)',
    shadow: colors.neutral[1000],
    scrim: colors.neutral[1000],
    // MD3's elevation levels are a subtle tint of `primary` blended into
    // `surface`, used as the background of Appbar/Menu/Dialog/FAB/Snackbar —
    // MD3LightTheme's defaults bake in its own purple primary, so they must
    // be re-derived from our tokens or those surfaces stay purple-tinted
    // even with `primary` itself overridden above.
    elevation: {
      level0: 'transparent',
      level1: colors.primary[50],
      level2: colors.primary[50],
      level3: colors.primary[100],
      level4: colors.primary[100],
      level5: colors.primary[100],
    },
  },
};

export type AppTheme = typeof theme;
