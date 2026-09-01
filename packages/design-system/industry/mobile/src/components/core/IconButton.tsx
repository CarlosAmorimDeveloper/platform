import { useState } from 'react';
import { Pressable } from 'react-native';
import type { GestureResponderEvent, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { accentRamp, alpha, color, control, danger } from '@industry/tokens';
import { Icon, type IconName } from './Icon';

export type IconButtonVariant = 'ghost' | 'solid' | 'danger';
export type IconButtonSize = 'sm' | 'md';

const BOX: Record<IconButtonSize, number> = { sm: control.heightSm, md: control.height };

export function resolveIconButtonBackground(variant: IconButtonVariant, pressed: boolean): string {
  if (variant === 'solid') return pressed ? accentRamp['500'] : color.accent;
  if (variant === 'danger') return pressed ? alpha(danger['400'], 16) : 'transparent';
  return pressed ? alpha(color.accent, 22) : 'transparent';
}

export function resolveIconButtonIconColor(variant: IconButtonVariant): string {
  if (variant === 'solid') return color.bg;
  if (variant === 'danger') return danger['300'];
  return accentRamp['300'];
}

function resolveIconButtonBorderColor(variant: IconButtonVariant): string {
  if (variant === 'solid') return 'transparent';
  if (variant === 'danger') return alpha(danger['400'], 45);
  return color.divider;
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
          borderWidth: variant === 'solid' ? 0 : 1,
          borderColor: resolveIconButtonBorderColor(variant),
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
