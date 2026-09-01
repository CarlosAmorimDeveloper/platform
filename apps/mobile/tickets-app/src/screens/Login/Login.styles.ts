import { StyleSheet } from 'react-native';
import { fontFamily, fontWeight, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[8],
  },
  header: { gap: space[2] },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  appTitle: {
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight.heading,
    fontSize: 38,
  },
  form: { gap: space[3] },
  footer: { gap: space[4] },
  divider: { height: 1 },
  footerHint: { textAlign: 'center', fontSize: 13 },
});
