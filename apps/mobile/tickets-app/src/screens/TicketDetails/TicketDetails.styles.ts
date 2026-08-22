import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  keyboardView: { flex: 1 },
  container: { paddingTop: space[6], gap: space[3], flexGrow: 1, paddingBottom: space[10] },
  paddedRow: { paddingHorizontal: space[6] },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    paddingHorizontal: space[6],
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 24,
    paddingHorizontal: space[6],
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: space[2],
    paddingHorizontal: space[6],
  },
  emptyComments: {
    fontSize: fontSize.sm,
    paddingHorizontal: space[6],
  },
  bold: { fontWeight: 'bold' as const },
});
