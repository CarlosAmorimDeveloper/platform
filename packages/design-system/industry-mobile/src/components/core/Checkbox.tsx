import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  style,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      testID="checkbox-root"
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: control.tap },
        style,
      ]}
    >
      <View
        testID="checkbox-box"
        style={{
          width: 18,
          height: 18,
          borderWidth: 1.5,
          borderColor: isChecked ? color.accent : color.dividerStrong,
          backgroundColor: isChecked ? color.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? (
          <View
            testID="checkbox-mark"
            style={{
              width: 10,
              height: 6,
              borderLeftWidth: 2,
              borderBottomWidth: 2,
              borderColor: color.bg,
              transform: [{ rotate: '-45deg' }, { translateY: -1 }],
            }}
          />
        ) : null}
      </View>
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
}
