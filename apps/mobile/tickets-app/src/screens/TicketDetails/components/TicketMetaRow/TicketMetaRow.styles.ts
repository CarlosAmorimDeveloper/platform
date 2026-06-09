import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  metaRow: { gap: spacing[1], paddingHorizontal: spacing[6] },
  metaText: { fontSize: fontSizes.sm, color: colors.neutral[500] },
});
