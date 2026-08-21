import { forwardRef, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { alpha, controlHeight, fontSize, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';

export type SelectSize = keyof typeof controlHeight;
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  /** Plain strings or {value,label} pairs. */
  options?: (string | SelectOption)[];
  value?: string;
  onChange?: (value: string) => void;
  size?: SelectSize;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * RN has no native `<select>` — this opens a modal sheet listing the
 * options instead. Use for 4+ options; below that use `RadioGroup` or
 * `SegmentedControl`, same guidance as the web version.
 */
export const Select = forwardRef<View, SelectProps>(function Select(
  {
    options = [],
    value,
    onChange,
    size = 'lg',
    invalid = false,
    disabled = false,
    placeholder = 'Selecionar',
    style,
  },
  ref,
) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const selected = normalized.find((o) => o.value === value);
  const borderColor = invalid ? alpha(vtColors.danger, 55) : colors.lineHairline;

  return (
    <View ref={ref} style={style}>
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={selected?.label ?? placeholder}
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: controlHeight[size],
          paddingHorizontal: 12,
          backgroundColor: colors.surfaceInput,
          borderWidth: 1,
          borderColor,
          borderRadius: 10,
          opacity: disabled ? 0.42 : 1,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: fontSize.md,
            color: selected ? colors.textHeading : colors.textTertiary,
          }}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Icon name="ChevronDown" size="sm" color={colors.textTertiary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: colors.glassScrim, justifyContent: 'flex-end' }}
        >
          <View
            style={{
              backgroundColor: colors.surfaceSolid,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '60%',
              paddingVertical: 8,
            }}
          >
            <FlatList
              data={normalized}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const on = item.value === value;
                return (
                  <Pressable
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: on }}
                    onPress={() => {
                      onChange?.(item.value);
                      setOpen(false);
                    }}
                    style={{
                      minHeight: 44,
                      justifyContent: 'center',
                      paddingHorizontal: 20,
                      backgroundColor: on ? colors.glass2 : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.md,
                        color: on ? colors.textHeading : colors.textPrimary,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});
