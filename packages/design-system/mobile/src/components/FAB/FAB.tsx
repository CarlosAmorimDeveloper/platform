import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FAB as PaperFAB } from 'react-native-paper';

export interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function FAB({ onPress, icon = 'plus', style, testID, accessibilityLabel }: FABProps) {
  return (
    <PaperFAB
      icon={icon}
      onPress={onPress}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
