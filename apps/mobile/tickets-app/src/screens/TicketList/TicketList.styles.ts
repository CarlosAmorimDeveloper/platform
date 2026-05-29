import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `${colors.neutral[100]}`,
    padding: spacing[4],
    gap: spacing[3],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fillHeight: { flex: 1 },
  list: { paddingVertical: spacing[2] },
  emptyText: { color: `${colors.neutral[500]}`, fontSize: fontSizes.base },
  ticketItem: { marginBottom: spacing[4], marginHorizontal: spacing[1] },
});
