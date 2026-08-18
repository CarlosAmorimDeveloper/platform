import React, { useState } from 'react';
import type { KeyboardTypeOptions } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';

// Derived from PaperTextInput's own prop type (rather than importing
// StyleProp<TextStyle> from 'react-native' directly) so it always matches
// exactly what react-native-paper expects, even if this package's react-native
// copy and react-native-paper's happen to resolve to different RN versions
// in the monorepo's node_modules tree.
type ContentStyle = React.ComponentProps<typeof PaperTextInput>['contentStyle'];

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
  accessibilityLabel?: string;
  onFocus?: () => void;
  /**
   * Style forwarded to Paper's TextInput `contentStyle` — applies directly to
   * the underlying native input (e.g. `minHeight`, `paddingLeft`), unlike the
   * outer `style` prop which only affects wrapper-level layout.
   */
  contentStyle?: ContentStyle;
}

export function Input({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines,
  keyboardType,
  autoCapitalize,
  testID,
  accessibilityLabel,
  onFocus,
  contentStyle,
}: InputProps) {
  const [hidden, setHidden] = useState(true);
  const isSecure = secureTextEntry && hidden;

  return (
    <>
      <PaperTextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        label={label}
        placeholder={placeholder}
        error={Boolean(error)}
        disabled={disabled}
        secureTextEntry={isSecure}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        onFocus={onFocus}
        contentStyle={contentStyle}
        right={
          secureTextEntry && showPasswordToggle ? (
            <PaperTextInput.Icon
              icon={hidden ? 'eye' : 'eye-off'}
              onPress={() => setHidden((h) => !h)}
              accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            />
          ) : undefined
        }
      />
      {error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}
    </>
  );
}
