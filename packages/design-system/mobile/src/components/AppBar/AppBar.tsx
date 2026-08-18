import React from 'react';
import { StyleSheet } from 'react-native';
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
    <Appbar.Header testID={testID}>
      {onBackPress && (
        <Appbar.BackAction
          onPress={onBackPress}
          style={styles.actionButton}
          testID={testID ? `${testID}-back` : undefined}
        />
      )}
      <Appbar.Content title={title} />
      {actions?.map((action) => (
        <Appbar.Action
          key={action.icon}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
          style={styles.actionButton}
          testID={action.testID}
        />
      ))}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    margin: 0,
  },
});
