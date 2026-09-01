import { StyleSheet } from 'react-native';
import { space } from '@industry/tokens';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: space[6], gap: space[4] },
  sectionLabelBlock: { gap: space[2] },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  sectionHairline: { height: 1 },
  metaLine: { fontSize: 11 },
  submitButton: { flex: 1 },
});
