import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  container: {
    padding: spacing[6],
    gap: spacing[4],
    backgroundColor: colors.neutral[0],
  },
  updatedAt: {
    fontSize: fontSizes.sm,
    color: colors.neutral[500],
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.neutral[900],
    marginTop: spacing[4],
  },
  fieldLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  fieldValue: {
    fontSize: fontSizes.base,
    color: colors.neutral[900],
  },
  field: {
    gap: spacing[1],
  },
  listItem: {
    fontSize: fontSizes.base,
    color: colors.neutral[900],
    marginLeft: spacing[2],
  },
  editButton: {
    marginTop: spacing[6],
  },
});
