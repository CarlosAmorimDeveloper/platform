import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  commentCard: {
    padding: space[3],
    gap: space[1],
  },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentAuthor: { fontSize: 13, fontWeight: '600' },
  commentDate: { fontSize: 12 },
  commentText: { fontSize: fontSize.body },
});
