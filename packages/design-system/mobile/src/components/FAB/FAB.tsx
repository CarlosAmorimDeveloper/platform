import React from 'react';
import { FAB as PaperFAB } from 'react-native-paper';

export interface FABProps {
  onPress: () => void;
  icon?: string;
  style?: React.ComponentProps<typeof PaperFAB>['style'];
  testID?: string;
  accessibilityLabel?: string;
}

export function FAB({ onPress, icon = 'plus', style, testID, accessibilityLabel }: FABProps) {
  return (
    <PaperFAB
      icon={icon}
      onPress={onPress}
      style={style}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
