import React, { useState } from 'react';
import type { KeyboardTypeOptions } from 'react-native';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';

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
        right={
          secureTextEntry && showPasswordToggle ? (
            <PaperTextInput.Icon
              icon={hidden ? 'eye' : 'eye-off'}
              onPress={() => setHidden((h) => !h)}
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
