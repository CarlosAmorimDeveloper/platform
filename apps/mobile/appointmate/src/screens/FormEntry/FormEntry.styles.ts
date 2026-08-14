import { StyleSheet } from 'react-native';
import { colors, fontSizes, radii, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    padding: spacing[6],
    gap: spacing[4],
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginTop: spacing[4],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  dynamicRow: {
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radii.lg,
    backgroundColor: colors.neutral[50],
  },
});
