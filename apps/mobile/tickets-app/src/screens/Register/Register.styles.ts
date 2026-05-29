import { StyleSheet } from 'react-native';
import { colors, fontSizes, radii, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[6],
    backgroundColor: `${colors.neutral[0]}`,
  },
  subtitle: { fontSize: fontSizes.base, color: `${colors.neutral[500]}`, textAlign: 'center' },
  form: { gap: spacing[3] },
  adminNotice: {
    backgroundColor: `${colors.primary[50]}`,
    borderRadius: radii.md,
    padding: spacing[3],
  },
  adminNoticeText: {
    fontSize: fontSizes.sm,
    color: `${colors.primary[700]}`,
    textAlign: 'center',
  },
});
