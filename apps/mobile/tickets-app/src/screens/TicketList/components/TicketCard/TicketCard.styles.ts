import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';

export const styles = StyleSheet.create({
  badgeRow: { flexDirection: 'row', gap: spacing[2], flexWrap: 'wrap' },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: spacing[1],
    borderRadius: radii.xl,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '600' },
  meta: { fontSize: fontSizes.xs, color: colors.neutral[500], marginTop: spacing[1] },
});
