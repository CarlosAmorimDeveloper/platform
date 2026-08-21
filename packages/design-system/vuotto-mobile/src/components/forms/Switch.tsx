import { forwardRef } from 'react';
import {
  Switch as RNSwitch,
  Text,
  View,
  type SwitchProps as RNSwitchProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { fontSize, fontWeight, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface SwitchProps extends Omit<
  RNSwitchProps,
  'value' | 'onValueChange' | 'onChange' | 'style' | 'trackColor' | 'thumbColor'
> {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export const Switch = forwardRef<RNSwitch, SwitchProps>(function Switch(
  { checked = false, onChange, label, description, disabled = false, style, ...rest },
  ref,
) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: space[4],
          alignItems: description ? 'flex-start' : 'center',
          minHeight: 44,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}
    >
      <RNSwitch
        ref={ref}
        value={checked}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.glass3, true: vtColors.white }}
        thumbColor={checked ? vtColors.black : vtColors.soft}
        {...rest}
      />
      {(label || description) && (
        <View style={{ gap: 2 }}>
          {label && (
            <Text
              style={{
                fontSize: fontSize.md,
                fontWeight: fontWeight.medium,
                color: colors.textHeading,
              }}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
              {description}
            </Text>
          )}
        </View>
      )}
    </View>
  );
});
