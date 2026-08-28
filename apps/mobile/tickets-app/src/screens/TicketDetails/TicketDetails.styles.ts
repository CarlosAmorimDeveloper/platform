import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  keyboardView: { flex: 1 },
  container: { paddingTop: space[6], gap: space[3], flexGrow: 1, paddingBottom: space[8] },
  paddedRow: { paddingHorizontal: space[6] },
  title: {
    fontSize: fontSize.h3,
    fontWeight: 'bold',
    paddingHorizontal: space[6],
  },
  description: {
    fontSize: fontSize.body,
    lineHeight: 24,
    paddingHorizontal: space[6],
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: space[2],
    paddingHorizontal: space[6],
  },
  emptyComments: {
    fontSize: 13,
    paddingHorizontal: space[6],
  },
  bold: { fontWeight: 'bold' as const },
});
