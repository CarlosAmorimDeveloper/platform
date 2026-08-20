import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, fontSizes, fontWeights, semanticColors, spacing } from '@ds/tokens';
import { Button } from '../Button';

export interface ErrorViewProps {
  description: string;
  title?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

export function ErrorView({
  description,
  title,
  icon = 'alert-circle-outline',
  actionLabel = 'Tentar novamente',
  onAction,
  testID,
}: ErrorViewProps) {
  return (
    <View style={styles.container} testID={testID}>
      {icon && <Icon source={icon} size={48} color={semanticColors.error} />}
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{description}</Text>
      {onAction && (
        <Button onPress={onAction} variant="secondary" style={styles.action}>
          {actionLabel}
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
    fontWeight: fontWeights.semibold,
    color: semanticColors.textPrimary,
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
