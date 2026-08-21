import { forwardRef } from 'react';
import { Pressable, ScrollView, Text, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, fontSize, fontWeight, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface TabItem {
  value: string;
  label: string;
  icon?: IconName;
  count?: number | string;
}

export interface TabsProps {
  tabs?: (string | TabItem)[];
  value?: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const Tabs = forwardRef<ScrollView, TabsProps>(function Tabs(
  { tabs = [], value, onChange, style },
  ref,
) {
  const { colors } = useTheme();
  const normalized = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t));

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      style={[{ borderBottomWidth: 1, borderBottomColor: colors.lineHairline }, style]}
      contentContainerStyle={{ flexDirection: 'row', gap: space[6] }}
    >
      {normalized.map((tab) => {
        const on = value === tab.value;
        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange?.(tab.value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: space[2],
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: on ? colors.textHeading : 'transparent',
            }}
          >
            {tab.icon && (
              <Icon
                name={tab.icon}
                size="sm"
                color={on ? colors.textHeading : colors.textSecondary}
              />
            )}
            <Text
              style={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: fontSize.md,
                color: on ? colors.textHeading : colors.textSecondary,
              }}
            >
              {tab.label}
            </Text>
            {tab.count != null && (
              <Text
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: fontSize.xs,
                  color: colors.textTertiary,
                }}
              >
                {tab.count}
              </Text>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
});
