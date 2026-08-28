import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[6],
  },
  subtitle: { fontSize: fontSize.body, textAlign: 'center' },
  form: { gap: space[3] },
  adminNotice: {
    padding: space[3],
  },
  adminNoticeText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
