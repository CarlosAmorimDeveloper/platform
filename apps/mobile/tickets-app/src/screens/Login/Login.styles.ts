import { StyleSheet } from 'react-native';
import { fontSize, space } from '@industry/tokens';

export const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[8],
  },
  header: { alignItems: 'center', gap: space[2] },
  appTitle: { fontSize: fontSize.h3, fontWeight: 'bold' },
  appSubtitle: { fontSize: fontSize.body },
  form: { gap: space[3] },
});
