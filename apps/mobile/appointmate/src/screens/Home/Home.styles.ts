import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: space[6],
    paddingBottom: space[6],
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContent: {
    padding: space[6],
    gap: space[3],
  },
  card: {
    marginBottom: space[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space[1],
  },
  cardDate: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  cardSummary: {
    fontSize: fontSize.sm,
    marginTop: space[2],
  },
});
