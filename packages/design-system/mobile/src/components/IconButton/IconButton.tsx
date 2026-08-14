import React from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { colors } from '@ds/tokens';

export interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
  accessibilityLabel?: string;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  disabled = false,
  size = 24,
  accessibilityLabel,
  testID,
}: IconButtonProps) {
  return (
    <PaperIconButton
      icon={icon}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      size={size}
      iconColor={`${colors.neutral[700]}`}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}
