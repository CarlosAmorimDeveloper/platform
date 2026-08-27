import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { alpha, color, control, space } from '@industry/tokens';

export interface TabBarItem {
  id?: string;
  label?: ReactNode;
  icon?: ReactNode;
}

export interface TabBarProps {
  items?: TabBarItem[];
  current?: string;
  onSelect?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Bottom navigation bar. Respects the device's safe-area bottom inset. */
export function TabBar({ items = [], current, onSelect, style }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: color.divider,
          backgroundColor: color.bg,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      {items.map((item, index) => {
        const id = item.id ?? (typeof item.label === 'string' ? item.label : String(index));
        const active = current === id;
        return (
          <Pressable
            key={id}
            testID={`tabbar-item-${id}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={onSelect ? () => onSelect(id) : undefined}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              minHeight: control.tap,
              paddingVertical: space[2],
            }}
          >
            {item.icon ? <View style={{ opacity: active ? 1 : 0.85 }}>{item.icon}</View> : null}
            {item.label ? (
              <Text
                style={{
                  fontSize: 11,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  color: active ? color.accent : alpha(color.text, 55),
                }}
              >
                {item.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
