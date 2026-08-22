import { StyleSheet } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboardView: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: space[6],
    gap: space[8],
  },
  header: { alignItems: 'center', gap: space[2] },
  title: { fontSize: fontSize['3xl'], fontWeight: 'bold' },
  subtitle: { fontSize: fontSize.md, textAlign: 'center' },
  form: { gap: space[3] },
});
