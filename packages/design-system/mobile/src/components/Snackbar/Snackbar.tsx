import React from 'react';
import { Snackbar as PaperSnackbar } from 'react-native-paper';

export interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
  action?: { label: string; onPress: () => void };
  testID?: string;
}

export function Snackbar({
  visible,
  onDismiss,
  message,
  duration = 1500,
  action,
  testID,
}: SnackbarProps) {
  if (!visible) return null;

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      testID={testID}
    >
      {message}
    </PaperSnackbar>
  );
}
