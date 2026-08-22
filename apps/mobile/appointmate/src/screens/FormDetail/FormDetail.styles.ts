import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    padding: space[6],
    gap: space[4],
  },
  updatedAt: {
    fontSize: fontSize.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginTop: space[4],
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: fontSize.md,
  },
  field: {
    gap: space[1],
  },
  listItem: {
    fontSize: fontSize.md,
    marginLeft: space[2],
  },
  editButton: {
    marginTop: space[6],
  },
});
