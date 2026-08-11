import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-paper';
import { colors, fontSizes, spacing } from '@ds/tokens';
import { Button } from '../Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  testID,
}: EmptyStateProps) {
  return (
    <View style={styles.container} testID={testID}>
      {icon && <Icon source={icon} size={48} color={`${colors.neutral[400]}`} />}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button onPress={onAction} style={styles.action}>
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
    fontWeight: '600',
    color: `${colors.neutral[900]}`,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSizes.sm,
    color: `${colors.neutral[500]}`,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[4],
  },
});
