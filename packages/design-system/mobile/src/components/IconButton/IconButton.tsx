import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton as PaperIconButton } from 'react-native-paper';
import { colors, semanticColors } from '@ds/tokens';

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
  primary: semanticColors.accent,
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
      style={styles.button}
    />
  );
}

// react-native-paper's IconButton hardcodes `margin: 6` on its container,
// which is layout the consuming screen should control, not the component.
const styles = StyleSheet.create({
  button: {
    margin: 0,
  },
});
