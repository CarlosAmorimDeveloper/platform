import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, neutral, alpha, space, control } from '@industry/tokens';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  style,
}: SwitchProps) {
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
      testID="switch-root"
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[3],
          minHeight: control.tap,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <Pressable
        testID="switch-track"
        onPress={toggle}
        disabled={disabled}
        style={{
          width: 44,
          height: 24,
          borderWidth: 1,
          borderColor: isChecked ? color.accent : color.dividerStrong,
          backgroundColor: isChecked ? alpha(color.accent, 28) : color.surface,
        }}
      >
        <Pressable
          testID="switch-thumb"
          onPress={toggle}
          disabled={disabled}
          style={{
            position: 'absolute',
            top: 3,
            left: isChecked ? 23 : 3,
            width: 16,
            height: 16,
            backgroundColor: isChecked ? color.accent : neutral['400'],
          }}
        />
      </Pressable>
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
}
