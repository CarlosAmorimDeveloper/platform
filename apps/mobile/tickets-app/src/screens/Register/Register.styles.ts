import { StyleSheet } from 'react-native';
import { fontSize, radii, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[6],
  },
  subtitle: { fontSize: fontSize.md, textAlign: 'center' },
  form: { gap: space[3] },
  adminNotice: {
    borderRadius: radii.sm,
    padding: space[3],
  },
  adminNoticeText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
