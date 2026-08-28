import { Pressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { color, shadow } from '@industry/tokens';
import { Icon, type IconName } from './Icon';

export type FABSize = 'md' | 'lg';

const BOX: Record<FABSize, number> = { md: 48, lg: 56 };

export function resolveFabBackground(pressed: boolean): string {
  return pressed ? color.accent2 : color.accent;
}

export interface FABProps extends Omit<PressableProps, 'style' | 'disabled'> {
  icon?: IconName;
  /** Required — becomes accessibilityLabel. */
  label: string;
  size?: FABSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Floating action button — anchor it with absolute positioning via `style`. */
export function FAB({
  icon = 'Plus',
  label,
  size = 'lg',
  disabled = false,
  style,
  ...rest
}: FABProps) {
  const box = BOX[size];

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        {
          width: box,
          height: box,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          backgroundColor: resolveFabBackground(pressed),
          opacity: disabled ? 0.45 : 1,
        },
        shadow.lg,
        style,
      ]}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} color={color.bg} />
    </Pressable>
  );
}
