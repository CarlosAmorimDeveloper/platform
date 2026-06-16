import { StyleSheet } from 'react-native';
import { fontSizes, spacing, radii } from '@ds/tokens';

export const sharedOptionFieldStyles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii['2xl'],
  },
  badgeText: { fontSize: fontSizes.sm, fontWeight: '600' },
  listLeadingSpace: { width: spacing[4] },
  listSeparator: { width: spacing[2] },
  optionButton: { width: 120 },
});
