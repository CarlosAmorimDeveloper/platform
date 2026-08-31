import { StyleSheet } from 'react-native';
import { space } from '@industry/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space[6],
    paddingVertical: space[4],
  },
  countText: { fontSize: 13 },
  listContent: {
    paddingHorizontal: space[6],
    paddingBottom: space[6],
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: space[6],
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[3],
    paddingVertical: space[4],
  },
  loadingCaption: { fontSize: 13 },
  skeletonCard: { marginBottom: space[3] },
  bottomBar: {
    borderTopWidth: 1,
    paddingTop: space[3],
    paddingHorizontal: space[6],
  },
});
