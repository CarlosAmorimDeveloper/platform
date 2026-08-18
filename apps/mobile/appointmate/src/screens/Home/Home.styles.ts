import { StyleSheet } from 'react-native';
import { colors, fontSizes, radii, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: spacing[6],
    paddingBottom: spacing[6],
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
    padding: spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[1],
  },
  cardDate: {
    flex: 1,
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.full,
  },
  statusBadgeDraft: {
    backgroundColor: colors.neutral[100],
  },
  statusBadgeSubmitted: {
    backgroundColor: colors.primary[100],
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  statusTextDraft: {
    color: colors.neutral[600],
  },
  statusTextSubmitted: {
    color: colors.primary[700],
  },
  cardSummary: {
    fontSize: fontSizes.sm,
    color: colors.neutral[500],
    marginTop: spacing[2],
  },
});
