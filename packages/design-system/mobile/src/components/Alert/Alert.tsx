import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, radii } from '@ds/tokens';

export type AlertVariant = 'error' | 'warning' | 'success' | 'info';

export interface AlertProps {
  message: string;
  variant?: AlertVariant;
  testID?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; text: string }> = {
  error: { bg: `${colors.error[100]}`, text: `${colors.error[700]}` },
  warning: { bg: `${colors.warning[100]}`, text: `${colors.warning[700]}` },
  success: { bg: `${colors.success[100]}`, text: `${colors.success[700]}` },
  info: { bg: `${colors.info[100]}`, text: `${colors.info[700]}` },
};

export function Alert({ message, variant = 'error', testID }: AlertProps) {
  if (!message) return null;

  const { bg, text } = variantStyles[variant];

  return (
    <View style={[styles.container, { backgroundColor: bg }]} testID={testID}>
      <Text style={[styles.text, { color: text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  text: { fontSize: fontSizes.sm, fontWeight: '500' },
});
