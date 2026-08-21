import { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  alpha,
  fontFamily,
  fontSize,
  resolveLineHeight,
  lineHeight,
  vtColors,
} from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface TextareaProps extends Omit<
  TextInputProps,
  'style' | 'multiline' | 'numberOfLines'
> {
  rows?: number;
  invalid?: boolean;
  /** Mono character counter pinned bottom-right, e.g. "84/280". */
  counter?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Multi-line text. RN has no user-draggable resize handle at all (not even
 * a horizontal one to disable) — `rows` sets a fixed starting height instead
 * of the web version's CSS `resize: vertical`.
 */
export const Textarea = forwardRef<TextInput, TextareaProps>(function Textarea(
  { rows = 4, invalid = false, counter, editable = true, style, onFocus, onBlur, ...rest },
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
  const lineHeightPx = resolveLineHeight(fontSize.md, lineHeight.normal);

  return (
    <View
      style={[
        {
          backgroundColor: colors.surfaceInput,
          borderWidth: 1,
          borderColor,
          borderRadius: 10,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}
    >
      <TextInput
        ref={ref}
        multiline
        numberOfLines={rows}
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
          minHeight: rows * lineHeightPx + 20,
          padding: 10,
          paddingHorizontal: 12,
          textAlignVertical: 'top',
          fontFamily: fontFamily.sans,
          fontSize: fontSize.md,
          lineHeight: lineHeightPx,
          color: colors.textHeading,
        }}
        placeholderTextColor={colors.textTertiary}
        {...rest}
      />
      {counter && (
        <Text
          style={{
            position: 'absolute',
            right: 10,
            bottom: 8,
            fontFamily: fontFamily.mono,
            fontSize: fontSize.xs,
            color: colors.textTertiary,
          }}
        >
          {counter}
        </Text>
      )}
    </View>
  );
});
