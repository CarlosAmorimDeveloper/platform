import { StyleSheet } from 'react-native';
import { space } from '@industry/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    padding: space[6],
    gap: space[6],
  },
  form: { gap: space[3] },
  adminNotice: {
    padding: space[3],
    gap: space[1],
    borderLeftWidth: 2,
  },
  adminNoticeKicker: {
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  adminNoticeText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
