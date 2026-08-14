import React from 'react';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { colors } from '@ds/tokens';

type Variant = 'default' | 'primary';

export interface IconButtonProps {
  icon: string;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  size?: number;
  accessibilityLabel?: string;
  testID?: string;
}

const colorByVariant: Record<Variant, string> = {
  default: `${colors.neutral[700]}`,
  primary: `${colors.primary[600]}`,
};

export function IconButton({
  icon,
  variant = 'default',
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
      iconColor={colorByVariant[variant]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    />
  );
}
