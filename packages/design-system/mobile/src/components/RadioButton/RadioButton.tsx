import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableRipple, Text, RadioButton as PaperRadioButton } from 'react-native-paper';

export interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export function RadioButton({
  selected,
  onPress,
  label = '',
  disabled = false,
  testID,
  accessibilityLabel,
}: RadioButtonProps) {
  /*
   * Dual-disable pattern (same as Checkbox):
   *   - `disabled` on TouchableRipple: provides visual feedback (greyed-out appearance)
   *   - `onPress` guard: ensures onPress is never called when disabled,
   *     covering test environments where TouchableRipple's disabled prop may not
   *     suppress the press handler.
   */
  return (
    <TouchableRipple
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
    >
      <View style={styles.container}>
        <Text>{label}</Text>
        <PaperRadioButton
          status={selected ? 'checked' : 'unchecked'}
          disabled={disabled}
          onPress={disabled ? undefined : onPress}
          value={label}
        />
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
