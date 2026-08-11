import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { Button } from '../Button';

export interface ErrorViewProps {
  message: string;
  title?: string;
  icon?: string;
  retryLabel?: string;
  onRetry?: () => void;
  testID?: string;
}

export function ErrorView({
  message,
  title,
  icon = 'alert-circle-outline',
  retryLabel = 'Tentar novamente',
  onRetry,
  testID,
}: ErrorViewProps) {
  return (
    <View style={styles.container} testID={testID}>
      <Icon source={icon} size={48} color={`${colors.error[500]}`} />
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button onPress={onRetry} variant="secondary" style={styles.action}>
          {retryLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
    gap: spacing[2],
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: `${colors.neutral[900]}`,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSizes.sm,
    color: `${colors.error[700]}`,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[4],
  },
});
