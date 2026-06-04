import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';

export const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerIcons: { flexDirection: 'row' },
  headerIcon: { paddingHorizontal: spacing[2] },
  container: { padding: spacing[6], gap: spacing[3] },
  title: { fontSize: fontSizes['2xl'], fontWeight: 'bold', color: `${colors.neutral[900]}` },
  description: { fontSize: fontSizes.base, color: `${colors.neutral[500]}`, lineHeight: 24 },
  sectionLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: `${colors.neutral[700]}`,
    marginTop: spacing[2],
  },
  emptyComments: { fontSize: fontSizes.sm, color: `${colors.neutral[400]}` },
  bold: { fontWeight: 'bold' as const },
});
