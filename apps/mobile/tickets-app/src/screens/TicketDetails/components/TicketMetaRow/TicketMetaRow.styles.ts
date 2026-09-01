import { StyleSheet } from 'react-native';
import { space } from '@industry/tokens';

export const styles = StyleSheet.create({
  grid: { gap: 1, marginHorizontal: space[6] },
  row: { flexDirection: 'row', gap: 1 },
  cell: { flex: 1, padding: space[3], gap: space[1] },
  cellLabel: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' },
  cellValue: { fontSize: 15 },
});
