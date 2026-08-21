import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { radii, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

const BOX = { sm: 32, md: 40, lg: 44 };

export type IconButtonVariant = 'ghost' | 'solid' | 'pill';
export type IconButtonSize = keyof typeof BOX;

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'disabled'> {
  /** Lucide icon name (PascalCase). */
  icon: IconName;
  /** Required — becomes accessibilityLabel. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  /** Sticky pressed styling for toggled toolbar buttons. */
  active?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  active = false,
  disabled = false,
  style,
  ...rest
}: IconButtonProps) {
  const { colors } = useTheme();
  const box = BOX[size];
  const solid = variant === 'solid';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => {
        const on = active || (pressed && !disabled);
        return [
          {
            width: box,
            height: box,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            borderRadius: variant === 'pill' ? radii.pill : radii.sm,
            backgroundColor: solid ? vtColors.white : on ? colors.glass2 : 'transparent',
            borderWidth: 1,
            borderColor: on && !solid ? colors.lineStrong : 'transparent',
            opacity: disabled ? 0.42 : 1,
          },
          style,
        ];
      }}
      {...rest}
    >
      {({ pressed }: { pressed: boolean }) => {
        const on = active || (pressed && !disabled);
        const color = solid ? colors.textInverse : on ? colors.textHeading : colors.textSecondary;
        return <Icon name={icon} size={size === 'sm' ? 'sm' : 'md'} color={color} />;
      }}
    </Pressable>
  );
}
