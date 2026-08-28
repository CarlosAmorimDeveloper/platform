import { useState } from 'react';
import { Pressable } from 'react-native';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { accentRamp, alpha, color, control } from '@industry/tokens';
import { Icon, type IconName } from './Icon';

export type IconButtonVariant = 'ghost' | 'solid';
export type IconButtonSize = 'sm' | 'md';

const BOX: Record<IconButtonSize, number> = { sm: control.heightSm, md: control.height };

export function resolveIconButtonBackground(variant: IconButtonVariant, pressed: boolean): string {
  if (variant === 'solid') return pressed ? accentRamp['500'] : color.accent;
  return pressed ? alpha(color.accent, 22) : 'transparent';
}

export function resolveIconButtonIconColor(variant: IconButtonVariant): string {
  return variant === 'solid' ? color.bg : accentRamp['300'];
}

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'disabled'> {
  /** Lucide icon name (PascalCase). */
  icon: IconName;
  /** Required — becomes accessibilityLabel. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onPressIn,
  onPressOut,
  style,
  ...rest
}: IconButtonProps) {
  const [pressed, setPressed] = useState(false);
  const box = BOX[size];

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      onPressIn={(e: GestureResponderEvent) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        {
          width: box,
          height: box,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: variant === 'ghost' ? color.divider : 'transparent',
          backgroundColor: resolveIconButtonBackground(variant, pressed && !disabled),
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
      {...rest}
    >
      <Icon
        name={icon}
        size={size === 'sm' ? 'sm' : 'md'}
        color={resolveIconButtonIconColor(variant)}
      />
    </Pressable>
  );
}
