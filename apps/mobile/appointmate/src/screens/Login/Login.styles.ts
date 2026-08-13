import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[8],
    backgroundColor: colors.neutral[0],
  },
  header: { alignItems: 'center', gap: spacing[2] },
  appTitle: { fontSize: fontSizes['3xl'], fontWeight: 'bold', color: colors.primary[600] },
  appSubtitle: { fontSize: fontSizes.base, color: colors.neutral[500] },
  form: { gap: spacing[3] },
});
