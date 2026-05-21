import React, { useState } from 'react';
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
  testID?: string;
  accessibilityLabel?: string;
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
  testID,
  accessibilityLabel,
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
        testID={testID}
        accessibilityLabel={accessibilityLabel}
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
