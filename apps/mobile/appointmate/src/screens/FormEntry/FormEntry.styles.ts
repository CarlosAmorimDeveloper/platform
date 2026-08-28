import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    padding: space[6],
    paddingBottom: space[12],
    gap: space[4],
  },
  sectionTitle: {
    fontSize: fontSize.h5,
    fontWeight: 'bold',
    marginTop: space[4],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  errorText: {
    fontSize: 13,
  },
  dynamicRow: {
    gap: space[2],
    padding: space[3],
  },
});
