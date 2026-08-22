import { StyleSheet } from 'react-native';
import { fontSize, radii, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    padding: space[6],
    paddingBottom: space[16],
    gap: space[4],
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginTop: space[4],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[2],
  },
  errorText: {
    fontSize: fontSize.sm,
  },
  dynamicRow: {
    gap: space[2],
    padding: space[3],
    borderRadius: radii.lg,
  },
});
