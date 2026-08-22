import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    gap: space[4],
    paddingTop: space[4],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: space[6], bottom: space[8] },
  cardTitle: { fontSize: fontSize.md, fontWeight: '600', marginBottom: space[2] },
  recentItem: {
    paddingVertical: space[2],
    borderBottomWidth: 1,
  },
  recentTitle: { fontSize: fontSize.sm, fontWeight: '600' },
  recentMeta: { fontSize: fontSize.xs },
  statCardWrapper: { marginLeft: space[2] },
  sectionPad: { paddingHorizontal: space[4] },
  listHeaderSpacer: { width: space[2] },
  listFooterSpacer: { width: space[4] },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space[3] },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: '600' },
  emptySubtitle: { fontSize: fontSize.sm, textAlign: 'center' },
});
