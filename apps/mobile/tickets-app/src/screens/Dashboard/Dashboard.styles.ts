import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `${colors.neutral[100]}`,
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: spacing[6], bottom: spacing[8] },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  statCard: { minWidth: 100 },
  statContent: { alignItems: 'flex-start', marginTop: spacing[2], gap: spacing[1] },
  statCount: { fontSize: fontSizes['2xl'], fontWeight: 'bold', color: `${colors.neutral[900]}` },
  statBadge: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderRadius: radii.full,
  },
  statLabel: { fontSize: fontSizes.sm, fontWeight: '600' },
  recentItem: {
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: `${colors.neutral[200]}`,
  },
  recentTitle: { fontSize: fontSizes.sm, fontWeight: '600', color: `${colors.neutral[900]}` },
  recentMeta: { fontSize: fontSizes.xs, color: `${colors.neutral[500]}` },
  statCardWrapper: { marginLeft: spacing[2] },
  sectionPad: { paddingHorizontal: spacing[4] },
  listHeaderSpacer: { width: spacing[2] },
  listFooterSpacer: { width: spacing[4] },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing[3] },
  emptyTitle: { fontSize: fontSizes.lg, fontWeight: '600', color: `${colors.neutral[700]}` },
  emptySubtitle: { fontSize: fontSizes.sm, color: `${colors.neutral[400]}`, textAlign: 'center' },
});
