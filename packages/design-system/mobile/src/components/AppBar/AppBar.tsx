import React from 'react';
import { Appbar } from 'react-native-paper';

export interface AppBarAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
}

export interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  actions?: AppBarAction[];
  testID?: string;
}

export function AppBar({ title, onBackPress, actions, testID }: AppBarProps) {
  return (
    // `elevated` left explicitly false — this app bar must stay flat, no shadow.
    <Appbar.Header testID={testID} elevated={false}>
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} testID={testID ? `${testID}-back` : undefined} />
      )}
      <Appbar.Content title={title} />
      {actions?.map((action) => (
        <Appbar.Action
          key={action.icon}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
          testID={action.testID}
        />
      ))}
    </Appbar.Header>
  );
}
