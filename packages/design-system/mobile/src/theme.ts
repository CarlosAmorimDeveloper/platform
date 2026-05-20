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
    error: colors.error[500],
    onError: colors.neutral[0],
    background: colors.neutral[50],
    onBackground: colors.neutral[900],
    surface: colors.neutral[0],
    onSurface: colors.neutral[900],
    surfaceVariant: colors.neutral[100],
    onSurfaceVariant: colors.neutral[600],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
  },
};

export type AppTheme = typeof theme;
