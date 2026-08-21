import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { radii, shadow, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

export type FABSize = 'md' | 'lg';

const BOX: Record<FABSize, number> = { md: 48, lg: 56 };

export interface FABProps extends Omit<PressableProps, 'style' | 'disabled'> {
  icon?: IconName;
  /** Required — becomes accessibilityLabel. */
  label: string;
  size?: FABSize;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function FAB({
  icon = 'Plus',
  label,
  size = 'lg',
  disabled = false,
  style,
  ...rest
}: FABProps) {
  const { colors } = useTheme();
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
          borderRadius: radii.pill,
          backgroundColor: pressed ? vtColors.pure : vtColors.white,
          opacity: disabled ? 0.42 : 1,
          ...shadow.lg,
        },
        style,
      ]}
      {...rest}
    >
      <Icon name={icon} size={size === 'lg' ? 'md' : 'sm'} color={colors.textInverse} />
    </Pressable>
  );
}
