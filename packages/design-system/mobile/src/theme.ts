import { MD3LightTheme } from 'react-native-paper';
import { colors, radii } from '@ds/tokens';

export const theme = {
  ...MD3LightTheme,
  roundness: radii.md,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[600],
    onPrimary: colors.neutral[0],
    primaryContainer: colors.primary[100],
    onPrimaryContainer: colors.primary[900],
    secondary: colors.primary[400],
    onSecondary: colors.neutral[0],
    secondaryContainer: colors.primary[100],
    onSecondaryContainer: colors.primary[900],
    tertiary: colors.primary[600],
    onTertiary: colors.neutral[0],
    tertiaryContainer: colors.primary[100],
    onTertiaryContainer: colors.primary[900],
    error: colors.error[500],
    onError: colors.neutral[0],
    background: colors.neutral[50],
    onBackground: colors.neutral[900],
    surface: colors.neutral[0],
    onSurface: colors.neutral[900],
    surfaceVariant: colors.neutral[100],
    onSurfaceVariant: colors.neutral[600],
    surfaceDisabled: colors.neutral[200],
    onSurfaceDisabled: colors.neutral[400],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
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
