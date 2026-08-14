import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    padding: spacing[6],
    backgroundColor: colors.neutral[0],
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing[6],
    gap: spacing[3],
  },
  card: {
    marginBottom: spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  cardStatus: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.primary[600],
  },
  cardSummary: {
    fontSize: fontSizes.sm,
    color: colors.neutral[600],
    marginTop: spacing[1],
  },
});
