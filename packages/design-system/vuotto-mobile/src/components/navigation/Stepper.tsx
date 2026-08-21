import { Fragment } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, fontSize, fontWeight, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';

export interface StepItem {
  label: string;
}

export interface StepperProps {
  steps?: (string | StepItem)[];
  /** Index of the active step; earlier steps render as done. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
}

export function Stepper({
  steps = [],
  current = 0,
  orientation = 'horizontal',
  style,
}: StepperProps) {
  const { colors } = useTheme();
  const row = orientation === 'horizontal';

  return (
    <View
      accessible
      accessibilityLabel={`Passo ${current + 1} de ${steps.length}`}
      style={[
        {
          flexDirection: row ? 'row' : 'column',
          gap: row ? 16 : 12,
          alignItems: row ? 'center' : 'stretch',
        },
        style,
      ]}
    >
      {steps.map((s, i) => {
        const label = typeof s === 'string' ? s : s.label;
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={label}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 11,
                  backgroundColor: done ? vtColors.white : active ? colors.glass3 : 'transparent',
                  borderWidth: done ? 0 : 1,
                  borderColor: active ? colors.lineFocus : colors.lineHairline,
                }}
              >
                {done ? (
                  <Icon name="Check" size="xs" color={colors.textInverse} />
                ) : (
                  <Text
                    style={{
                      fontFamily: fontFamily.mono,
                      fontWeight: fontWeight.medium,
                      fontSize: 11,
                      color: colors.textSecondary,
                    }}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.medium,
                  fontSize: fontSize.sm,
                  color: active
                    ? colors.textHeading
                    : done
                      ? colors.textSecondary
                      : colors.textTertiary,
                }}
              >
                {label}
              </Text>
            </View>
            {row && i < steps.length - 1 && (
              <View
                style={{
                  flex: 1,
                  height: 1,
                  minWidth: 20,
                  backgroundColor: done ? colors.lineStrong : colors.lineHairline,
                }}
              />
            )}
          </Fragment>
        );
      })}
    </View>
  );
}
