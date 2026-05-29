import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';

export const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerIcons: { flexDirection: 'row' },
  headerIcon: { paddingHorizontal: spacing[2] },
  container: { padding: spacing[6], gap: spacing[3] },
  title: { fontSize: fontSizes['2xl'], fontWeight: 'bold', color: `${colors.neutral[900]}` },
  description: { fontSize: fontSizes.base, color: `${colors.neutral[500]}`, lineHeight: 24 },
  metaRow: { gap: spacing[1] },
  metaText: { fontSize: fontSizes.sm, color: `${colors.neutral[500]}` },
  sectionLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: `${colors.neutral[700]}`,
    marginTop: spacing[2],
  },
  statusRow: { flexDirection: 'row', gap: spacing[2] },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii['2xl'],
  },
  statusBadgeText: { fontSize: fontSizes.sm, fontWeight: '600' },
  emptyComments: { fontSize: fontSizes.sm, color: `${colors.neutral[400]}` },
  commentCard: {
    backgroundColor: `${colors.neutral[200]}`,
    borderRadius: radii.lg,
    padding: spacing[3],
    gap: spacing[1],
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: fontSizes.sm, fontWeight: '600', color: `${colors.neutral[800]}` },
  commentDate: { fontSize: fontSizes.xs, color: `${colors.neutral[500]}` },
  commentText: { fontSize: fontSizes.base, color: `${colors.neutral[700]}` },
  bold: { fontWeight: 'bold' as const },
  priorityScrollContent: { paddingBottom: spacing[2] },
});
