import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontFamily, fontWeight, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface TabBarItem {
  value: string;
  label: string;
  icon: IconName;
}

export interface TabBarProps {
  /** Bottom navigation reads poorly past 5 items — keep it to 3–5. */
  items?: TabBarItem[];
  value?: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function TabBar({ items = [], value, onChange, style }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          paddingTop: 8,
          paddingHorizontal: 8,
          paddingBottom: Math.max(10, insets.bottom),
          backgroundColor: colors.glass2,
          borderTopWidth: 1,
          borderTopColor: colors.lineHairline,
        },
        style,
      ]}
    >
      {items.map((it) => {
        const on = value === it.value;
        return (
          <Pressable
            key={it.value}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange?.(it.value)}
            style={{
              flex: 1,
              alignItems: 'center',
              gap: 4,
              minHeight: space[10] + 4,
              paddingVertical: 6,
            }}
          >
            <Icon name={it.icon} size="md" color={on ? colors.textHeading : colors.textTertiary} />
            <Text
              style={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: 11,
                color: on ? colors.textHeading : colors.textTertiary,
              }}
            >
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
