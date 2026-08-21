import { forwardRef } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, fontWeight } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface SegmentedControlProps {
  options?: (string | SegmentedOption)[];
  value?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SegmentedControl = forwardRef<View, SegmentedControlProps>(function SegmentedControl(
  { options = [], value, onChange, size = 'md', fullWidth = false, style },
  ref,
) {
  const { colors } = useTheme();
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const h = size === 'sm' ? 30 : 36;

  return (
    <View
      ref={ref}
      accessibilityRole="radiogroup"
      style={[
        {
          flexDirection: 'row',
          gap: 2,
          padding: 3,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          backgroundColor: colors.glass1,
          borderWidth: 1,
          borderColor: colors.lineHairline,
          borderRadius: 10,
        },
        style,
      ]}
    >
      {normalized.map((opt) => {
        const on = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            onPress={() => onChange?.(opt.value)}
            style={{
              flexDirection: 'row',
              flex: fullWidth ? 1 : undefined,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              height: h,
              paddingHorizontal: 12,
              borderRadius: 7,
              backgroundColor: on ? colors.glass3 : 'transparent',
              borderWidth: 1,
              borderColor: on ? colors.lineHairline : 'transparent',
            }}
          >
            {opt.icon && (
              <Icon
                name={opt.icon}
                size="xs"
                color={on ? colors.textHeading : colors.textSecondary}
              />
            )}
            <Text
              style={{
                fontSize: fontSize.sm,
                fontWeight: fontWeight.medium,
                color: on ? colors.textHeading : colors.textSecondary,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});
