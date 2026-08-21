import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[6],
  },
  description: {
    fontSize: fontSize.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: { gap: space[3] },
});
