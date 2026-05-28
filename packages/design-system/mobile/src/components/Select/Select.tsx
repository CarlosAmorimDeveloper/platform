import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu as PaperMenu, TouchableRipple, Text, Icon } from 'react-native-paper';
import { colors, spacing } from '@ds/tokens';

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
            <View style={styles.trigger}>
              <View>
                {label && <Text variant="labelSmall">{label}</Text>}
                <Text>{selectedLabel}</Text>
              </View>
              <Icon source="chevron-down" size={20} color={`${colors.neutral[500]}`} />
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

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    gap: spacing[4],
  },
});
