import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[6],
    backgroundColor: colors.neutral[0],
  },
  description: {
    fontSize: fontSizes.base,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
  },
  form: { gap: spacing[3] },
});
