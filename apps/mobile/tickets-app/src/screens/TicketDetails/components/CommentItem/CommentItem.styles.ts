import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';

export const styles = StyleSheet.create({
  commentCard: {
    backgroundColor: colors.neutral[200],
    borderRadius: radii.lg,
    padding: spacing[3],
    gap: spacing[1],
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.neutral[800] },
  commentDate: { fontSize: fontSizes.xs, color: colors.neutral[500] },
  commentText: { fontSize: fontSizes.base, color: colors.neutral[700] },
});
