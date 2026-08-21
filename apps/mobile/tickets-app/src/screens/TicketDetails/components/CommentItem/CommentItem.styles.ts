import { StyleSheet } from 'react-native';
import { fontSize, radii, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  commentCard: {
    borderRadius: radii.md,
    padding: space[3],
    gap: space[1],
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: fontSize.sm, fontWeight: '600' },
  commentDate: { fontSize: fontSize.xs },
  commentText: { fontSize: fontSize.md },
});
