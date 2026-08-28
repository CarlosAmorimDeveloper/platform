import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    padding: space[6],
    gap: space[4],
  },
  updatedAt: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: fontSize.h5,
    fontWeight: 'bold',
    marginTop: space[4],
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: fontSize.body,
  },
  field: {
    gap: space[1],
  },
  listItem: {
    fontSize: fontSize.body,
    marginLeft: space[2],
  },
  editButton: {
    marginTop: space[6],
  },
});
