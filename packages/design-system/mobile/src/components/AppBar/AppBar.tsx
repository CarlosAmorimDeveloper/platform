import React from 'react';
import { Appbar } from 'react-native-paper';

interface AppBarAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  actions?: AppBarAction[];
  testID?: string;
}

export function AppBar({ title, onBackPress, actions, testID }: AppBarProps) {
  return (
    <Appbar.Header testID={testID}>
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} testID={testID ? `${testID}-back` : undefined} />
      )}
      <Appbar.Content title={title} />
      {actions?.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
}
