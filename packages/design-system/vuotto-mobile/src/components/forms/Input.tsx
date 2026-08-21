import { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { alpha, controlHeight, fontFamily, fontSize, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export type InputSize = keyof typeof controlHeight;

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** `lg` = 48px — the touch-friendly size, default for mobile forms. */
  size?: InputSize;
  icon?: IconName;
  suffix?: string;
  invalid?: boolean;
  mono?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Single-line text control on a glass surface. Always inside a `Field`. */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    size = 'lg',
    icon,
    suffix,
    invalid = false,
    mono = false,
    editable = true,
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const disabled = editable === false;
  const borderColor = invalid
    ? alpha(vtColors.danger, 55)
    : focused
      ? colors.lineFocus
      : colors.lineHairline;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: controlHeight[size],
          paddingHorizontal: 12,
          backgroundColor: colors.surfaceInput,
          borderWidth: 1,
          borderColor,
          borderRadius: 10,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size="sm" color={colors.textTertiary} />}
      <TextInput
        ref={ref}
        editable={editable}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          minWidth: 0,
          padding: 0,
          fontFamily: mono ? fontFamily.mono : fontFamily.sans,
          fontSize: mono ? fontSize.sm : fontSize.md,
          color: colors.textHeading,
        }}
        placeholderTextColor={colors.textTertiary}
        {...rest}
      />
      {suffix && (
        <Text
          style={{ fontFamily: fontFamily.mono, fontSize: fontSize.xs, color: colors.textTertiary }}
        >
          {suffix}
        </Text>
      )}
    </View>
  );
});
