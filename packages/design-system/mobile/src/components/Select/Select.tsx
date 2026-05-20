import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu as PaperMenu, TouchableRipple, Text } from 'react-native-paper';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Selecione',
  disabled = false,
  testID,
}: SelectProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View testID={testID}>
      <PaperMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple
            onPress={() => setMenuVisible(true)}
            disabled={disabled}
            testID={testID ? `${testID}-trigger` : undefined}
          >
            <View>
              {label && <Text variant="labelSmall">{label}</Text>}
              <Text>{selectedLabel}</Text>
            </View>
          </TouchableRipple>
        }
      >
        {options.map((option) => (
          <PaperMenu.Item
            key={option.value}
            title={option.label}
            onPress={() => {
              onChange(option.value);
              setMenuVisible(false);
            }}
          />
        ))}
      </PaperMenu>
    </View>
  );
}
