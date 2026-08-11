import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { LoadingIndicator } from '../LoadingIndicator';

export interface LoadingViewProps {
  visible?: boolean;
  message?: string;
  testID?: string;
}

export function LoadingView({ visible = true, message, testID }: LoadingViewProps) {
  if (!visible) return null;

  return (
    <View style={styles.container} testID={testID}>
      <LoadingIndicator visible={visible} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
    gap: spacing[3],
  },
  message: {
    fontSize: fontSizes.sm,
    color: `${colors.neutral[600]}`,
    textAlign: 'center',
  },
});
