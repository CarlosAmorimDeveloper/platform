import React, { ReactNode } from 'react';
import { Dialog as PaperDialog, Portal } from 'react-native-paper';

export interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  testID?: string;
}

export function Dialog({ visible, onDismiss, title, children, actions, testID }: DialogProps) {
  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={onDismiss} testID={testID}>
        {title && <PaperDialog.Title>{title}</PaperDialog.Title>}
        {children != null && <PaperDialog.Content>{children}</PaperDialog.Content>}
        {actions != null && <PaperDialog.Actions>{actions}</PaperDialog.Actions>}
      </PaperDialog>
    </Portal>
  );
}
