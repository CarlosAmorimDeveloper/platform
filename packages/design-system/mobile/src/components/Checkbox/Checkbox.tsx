import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, Text, Checkbox as PaperCheckbox } from 'react-native-paper';

export interface CheckboxProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onValueChange,
  label = '',
  disabled = false,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <TouchableRipple
      onPress={disabled ? undefined : () => onValueChange(!checked)}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={styles.container}>
        <Text>{label}</Text>
        <PaperCheckbox.Android status={checked ? 'checked' : 'unchecked'} disabled={disabled} />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
