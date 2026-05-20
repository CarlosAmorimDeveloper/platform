import React, { ReactNode } from 'react';
import { Menu as PaperMenu } from 'react-native-paper';

export interface MenuItemOption {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: ReactNode;
  items: MenuItemOption[];
  testID?: string;
}

export function Menu({ visible, onDismiss, anchor, items, testID }: MenuProps) {
  return (
    <PaperMenu visible={visible} onDismiss={onDismiss} anchor={anchor} testID={testID}>
      {items.map((item) => (
        <PaperMenu.Item
          key={item.label}
          title={item.label}
          onPress={item.disabled ? undefined : item.onPress}
          disabled={item.disabled}
        />
      ))}
    </PaperMenu>
  );
}
