import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[8],
  },
  header: { alignItems: 'center', gap: spacing[2] },
  title: { fontSize: fontSizes['3xl'], fontWeight: 'bold', color: colors.primary[600] },
  subtitle: { fontSize: fontSizes.base, color: colors.neutral[500], textAlign: 'center' },
  form: { gap: spacing[3] },
});
