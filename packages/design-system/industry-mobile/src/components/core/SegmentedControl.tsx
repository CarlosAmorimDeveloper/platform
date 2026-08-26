import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  options?: (string | SegmentOption)[];
  value?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

function resolveOption(option: string | SegmentOption): SegmentOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function SegmentedControl({
  options = [],
  value,
  onValueChange,
  style,
}: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={[{ flexDirection: 'row', borderWidth: 1, borderColor: color.divider }, style]}
    >
      {options.map((option, index) => {
        const opt = resolveOption(option);
        const checked = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            testID={`segment-option-${opt.value}`}
            onPress={() => onValueChange?.(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space[2],
              minHeight: control.height,
              paddingHorizontal: space[4],
              borderLeftWidth: index > 0 ? 1 : 0,
              borderLeftColor: color.divider,
              backgroundColor: checked ? color.accent : 'transparent',
            }}
          >
            {opt.icon}
            {typeof opt.label === 'string' ? (
              <Text style={{ fontSize: 14, color: checked ? color.bg : color.text }}>
                {opt.label}
              </Text>
            ) : (
              opt.label
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
