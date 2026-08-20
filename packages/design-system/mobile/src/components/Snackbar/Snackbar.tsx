import React from 'react';
import { Text } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { colors, zIndices } from '@ds/tokens';
import { shadowStyle } from '@ds/tokens/platform/native';
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
  duration = 6000,
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
        position === 'top'
          ? {
              top: 0,
              bottom: 'auto',
              alignSelf: 'center',
              // Was a bare `999` for both — zIndex now names the stacking
              // layer (toast), and elevation reuses the top shadow tier
              // instead of an Android depth value with no real meaning.
              zIndex: zIndices.toast,
              elevation: shadowStyle(3).elevation,
            }
          : undefined
      }
      testID={testID}
    >
      {themed ? <Text style={{ color: themed.text }}>{message}</Text> : message}
    </PaperSnackbar>
  );
}
