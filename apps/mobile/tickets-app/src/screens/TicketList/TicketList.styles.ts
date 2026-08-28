import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: space[4],
    gap: space[3],
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fillHeight: { flex: 1 },
  list: { paddingVertical: space[2] },
  emptyText: { fontSize: fontSize.body },
  ticketItem: { marginBottom: space[4], marginHorizontal: space[1] },
});
