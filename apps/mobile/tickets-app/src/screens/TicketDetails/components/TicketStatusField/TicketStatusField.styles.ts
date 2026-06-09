import { StyleSheet } from 'react-native';
import { fontSizes, spacing, radii } from '@ds/tokens';

export const styles = StyleSheet.create({
  statusRow: { flexDirection: 'row', gap: spacing[2] },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii['2xl'],
  },
  statusBadgeText: { fontSize: fontSizes.sm, fontWeight: '600' },
});
