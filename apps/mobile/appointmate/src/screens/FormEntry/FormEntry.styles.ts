import { StyleSheet } from 'react-native';
import { space } from '@industry/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    padding: space[6],
    gap: space[4],
  },
  fieldRow: {
    flexDirection: 'row',
    gap: space[3],
  },
  fieldRowItem: { flex: 1 },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  errorText: {
    fontSize: 13,
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space[2],
  },
  dynamicRowInput: { flex: 1 },
  sectionCount: { fontSize: 12 },
  bottomBarButton: { flex: 1 },
});
