import { StyleSheet } from 'react-native';
import { fontSize, lineHeight, resolveLineHeight, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
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
    lineHeight: resolveLineHeight(fontSize.md, lineHeight.normal),
  },
  form: { gap: space[3] },
});
