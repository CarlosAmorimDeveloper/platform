import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { colors } from '@ds/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  children: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: React.ComponentProps<typeof PaperButton>['style'];
}

const modeMap: Record<Variant, 'contained' | 'outlined' | 'text'> = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  danger: 'contained',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onPress,
  testID,
  accessibilityLabel,
  style,
}: ButtonProps) {
  return (
    <PaperButton
      mode={modeMap[variant]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      compact={size === 'sm'}
      buttonColor={variant === 'danger' ? colors.error[500] : undefined}
      textColor={variant === 'danger' ? colors.neutral[0] : undefined}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={style}
    >
      {children}
    </PaperButton>
  );
}
