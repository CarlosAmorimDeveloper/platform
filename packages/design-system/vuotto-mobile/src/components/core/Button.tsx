import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  alpha,
  controlHeight,
  fontSize,
  fontWeight,
  letterSpacing,
  radii,
  resolveLetterSpacing,
  space,
  vtColors,
} from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children' | 'disabled'> {
  children: string;
  /** primary = light fill; secondary = glass; ghost = text only; danger = tinted destructive. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Lucide icon name (PascalCase) rendered before the label. */
  icon?: IconName;
  /** Lucide icon name (PascalCase) rendered after the label. */
  iconAfter?: IconName;
  disabled?: boolean;
  /** Swaps the leading icon for a spinner and blocks input. */
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const FONT_SIZE: Record<ButtonSize, number> = { sm: fontSize.sm, md: fontSize.md, lg: fontSize.md };

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const height = controlHeight[size];
  const textSize = FONT_SIZE[size];
  const iconSize = size === 'sm' ? 'xs' : 'sm';

  return (
    <Pressable
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => {
        const on = pressed && !disabled;
        const skin = buttonSkin(variant, colors, on);
        return [
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: space[2],
            height,
            paddingHorizontal: size === 'sm' ? 12 : size === 'md' ? 18 : 24,
            width: fullWidth ? '100%' : undefined,
            borderRadius: radii.sm,
            opacity: disabled ? 0.42 : 1,
            transform: on ? [{ scale: 0.985 }] : undefined,
            borderWidth: 1,
            ...skin,
          },
          style,
        ];
      }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColorFor(variant, colors)} />
      ) : icon ? (
        <Icon name={icon} size={iconSize} color={textColorFor(variant, colors)} />
      ) : null}
      <Text
        style={{
          color: textColorFor(variant, colors),
          fontSize: textSize,
          fontWeight: fontWeight.semibold,
          letterSpacing: resolveLetterSpacing(textSize, letterSpacing.tight),
        }}
      >
        {children}
      </Text>
      {iconAfter ? (
        <Icon name={iconAfter} size={iconSize} color={textColorFor(variant, colors)} />
      ) : null}
    </Pressable>
  );
}

function textColorFor(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
): string {
  if (variant === 'primary') return vtColors.black;
  if (variant === 'danger') return vtColors.danger;
  return colors.textHeading;
}

function buttonSkin(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
  pressed: boolean,
) {
  if (variant === 'primary') {
    return {
      backgroundColor: pressed ? vtColors.pure : vtColors.white,
      borderColor: 'transparent',
    };
  }
  if (variant === 'secondary') {
    return {
      backgroundColor: pressed ? colors.glass3 : colors.glass2,
      borderColor: pressed ? colors.lineStrong : colors.lineHairline,
    };
  }
  if (variant === 'ghost') {
    return {
      backgroundColor: pressed ? colors.glass1 : 'transparent',
      borderColor: 'transparent',
    };
  }
  return {
    backgroundColor: alpha(vtColors.danger, pressed ? 26 : 16),
    borderColor: alpha(vtColors.danger, 38),
  };
}
