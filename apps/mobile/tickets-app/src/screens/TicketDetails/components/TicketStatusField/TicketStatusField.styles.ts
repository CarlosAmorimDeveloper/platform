import { StyleSheet } from 'react-native';
import { spacing } from '@ds/tokens';
import { sharedOptionFieldStyles } from '../sharedOptionField.styles';

const localStyles = StyleSheet.create({
  statusRow: { flexDirection: 'row', gap: spacing[2] },
});

export const styles = {
  statusRow: localStyles.statusRow,
  statusBadge: sharedOptionFieldStyles.badge,
  statusBadgeText: sharedOptionFieldStyles.badgeText,
  listLeadingSpace: sharedOptionFieldStyles.listLeadingSpace,
  listSeparator: sharedOptionFieldStyles.listSeparator,
};
