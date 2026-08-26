import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface RadioOption {
  value: string;
  label: ReactNode;
}

export interface RadioGroupProps {
  label?: ReactNode;
  options?: (string | RadioOption)[];
  value?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

function resolveOption(option: string | RadioOption): RadioOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function RadioGroup({ label, options = [], value, onValueChange, style }: RadioGroupProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      style={[{ gap: space[2] }, style]}
    >
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 13, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
      {options.map((option) => {
        const opt = resolveOption(option);
        return (
          <RadioOptionItem
            key={opt.value}
            option={opt}
            checked={value === opt.value}
            onSelect={() => onValueChange?.(opt.value)}
          />
        );
      })}
    </View>
  );
}

function RadioOptionItem({
  option,
  checked,
  onSelect,
}: {
  option: RadioOption;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      testID={`radio-option-${option.value}`}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: control.tap }}
    >
      <View
        testID={`radio-dot-${option.value}`}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: checked ? color.accent : color.dividerStrong,
          backgroundColor: checked ? color.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.bg }} />
        ) : null}
      </View>
      {typeof option.label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{option.label}</Text>
      ) : (
        option.label
      )}
    </Pressable>
  );
}
