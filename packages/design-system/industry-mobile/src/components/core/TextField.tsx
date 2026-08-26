import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { BlurEvent, FocusEvent, StyleProp, TextInputProps, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, control, semanticColor, danger, alpha } from '@industry/tokens';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  hint,
  error,
  multiline,
  onFocus,
  onBlur,
  style,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? semanticColor.danger : focused ? color.accent : color.divider;

  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={{ fontSize: 13, color: alpha(color.text, 70) }}>{label}</Text> : null}
      <TextInput
        multiline={multiline}
        onFocus={(e: FocusEvent) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e: BlurEvent) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={alpha(color.text, 38)}
        selectionColor={color.accent}
        style={{
          minHeight: multiline ? 104 : control.height,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 8 : 0,
          fontSize: 15,
          color: color.text,
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor,
          borderRadius: 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        {...rest}
      />
      {error ? (
        <Text style={{ fontSize: 12, color: danger['300'] }}>{error}</Text>
      ) : hint ? (
        <Text style={{ fontSize: 12, color: alpha(color.text, 50) }}>{hint}</Text>
      ) : null}
    </View>
  );
}
