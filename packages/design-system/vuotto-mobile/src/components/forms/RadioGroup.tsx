import { forwardRef } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, fontWeight, radii, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface RadioOption {
  value: string;
  label: string;
  meta?: string;
}

export interface RadioGroupProps {
  options?: (string | RadioOption)[];
  value?: string;
  onChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Single choice among 2–5 options, rendered as selectable glass rows. */
export const RadioGroup = forwardRef<View, RadioGroupProps>(function RadioGroup(
  { options = [], value, onChange, style },
  ref,
) {
  const { colors } = useTheme();
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    <View ref={ref} accessibilityRole="radiogroup" style={[{ gap: space[2] }, style]}>
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
              gap: space[3],
              alignItems: 'center',
              minHeight: 44,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: on ? colors.glass2 : 'transparent',
              borderWidth: 1,
              borderColor: on ? colors.lineStrong : colors.lineHairline,
            }}
          >
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: radii.pill,
                borderWidth: 1,
                borderColor: on ? colors.accent : colors.lineStrong,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {on && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: radii.pill,
                    backgroundColor: colors.accent,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: fontWeight.medium,
                color: on ? colors.textHeading : colors.textPrimary,
              }}
            >
              {opt.label}
            </Text>
            {opt.meta && (
              <Text
                style={{ marginLeft: 'auto', fontSize: fontSize.xs, color: colors.textTertiary }}
              >
                {opt.meta}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
});
