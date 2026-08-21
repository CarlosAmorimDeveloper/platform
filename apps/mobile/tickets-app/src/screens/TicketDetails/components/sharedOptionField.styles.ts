import { StyleSheet } from 'react-native';
import { space } from '@vuotto/tokens';

export const sharedOptionFieldStyles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', marginHorizontal: space[4] },
  listLeadingSpace: { width: space[4] },
  listSeparator: { width: space[2] },
  optionButton: { width: 120 },
});
