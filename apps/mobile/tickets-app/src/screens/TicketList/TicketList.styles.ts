import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: space[4],
    gap: space[3],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fillHeight: { flex: 1 },
  list: { paddingVertical: space[2] },
  emptyText: { fontSize: fontSize.md },
  ticketItem: { marginBottom: space[4], marginHorizontal: space[1] },
});
