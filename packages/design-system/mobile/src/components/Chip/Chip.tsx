import React from 'react';
import { Chip as PaperChip } from 'react-native-paper';

export interface ChipProps {
  children: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  icon?: string;
  testID?: string;
  accessibilityLabel?: string;
}

export function Chip({
  children,
  selected = false,
  onPress,
  disabled = false,
  icon,
  testID,
  accessibilityLabel,
}: ChipProps) {
  return (
    <PaperChip
      selected={selected}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      icon={icon}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
    >
      {children}
    </PaperChip>
  );
}
