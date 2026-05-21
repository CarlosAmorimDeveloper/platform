import React from 'react';
import { Text } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { colors } from '@ds/tokens';
import type { AlertVariant } from '../Alert';

const variantStyles: Record<AlertVariant, { bg: string; text: string }> = {
  error: { bg: `${colors.error[100]}`, text: `${colors.error[700]}` },
  warning: { bg: `${colors.warning[100]}`, text: `${colors.warning[700]}` },
  success: { bg: `${colors.success[100]}`, text: `${colors.success[700]}` },
  info: { bg: `${colors.info[100]}`, text: `${colors.info[700]}` },
};

export interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  variant?: AlertVariant;
  position?: 'top' | 'bottom';
  duration?: number;
  action?: { label: string; onPress: () => void };
  testID?: string;
}

export function Snackbar({
  visible,
  onDismiss,
  message,
  variant,
  position = 'bottom',
  duration = 1500,
  action,
  testID,
}: SnackbarProps) {
  const themed = variant ? variantStyles[variant] : null;

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      style={themed ? { backgroundColor: themed.bg } : undefined}
      wrapperStyle={
        position === 'top' ? { top: 0, bottom: 'auto', alignItems: 'center' } : undefined
      }
      testID={testID}
    >
      {themed ? <Text style={{ color: themed.text }}>{message}</Text> : message}
    </PaperSnackbar>
  );
}
