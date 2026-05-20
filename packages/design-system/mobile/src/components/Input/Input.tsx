import React from 'react';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
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
  testID,
  accessibilityLabel,
}: InputProps) {
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
        secureTextEntry={secureTextEntry}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      />
      {error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}
    </>
  );
}
