import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import { getContainerClasses, getTextClasses } from './button-classes';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
  className?: string;
  testID?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onPress,
  className = '',
  testID,
}: ButtonProps) {
  return (
    <Pressable
      className={getContainerClasses(variant, size, disabled, className)}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text className={getTextClasses(variant, size)}>{children}</Text>
    </Pressable>
  );
}
