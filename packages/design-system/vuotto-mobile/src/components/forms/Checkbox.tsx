import { forwardRef } from 'react';
import {
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { fontSize, fontWeight, radii, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';

export interface CheckboxProps {
  label: string;
  /** Secondary line under the label. */
  description?: string;
  checked?: boolean;
  /**
   * RN's `accessibilityState.checked` accepts `'mixed'` natively — that's
   * the real indeterminate state VoiceOver/TalkBack announce, not just a
   * visual stand-in (mirrors the DOM `indeterminate` property the web
   * `Checkbox` sets via ref).
   */
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean, e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

export const Checkbox = forwardRef<View, CheckboxProps>(function Checkbox(
  { label, description, checked = false, indeterminate = false, disabled = false, onChange, style },
  ref,
) {
  const { colors } = useTheme();
  const on = checked || indeterminate;

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}
      accessibilityLabel={label}
      onPress={(e) => onChange?.(!checked, e)}
      style={[
        {
          flexDirection: 'row',
          gap: space[3],
          alignItems: description ? 'flex-start' : 'center',
          minHeight: 44,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 20,
          height: 20,
          marginTop: description ? 2 : 0,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.xs,
          backgroundColor: on ? vtColors.white : colors.surfaceInput,
          borderWidth: on ? 0 : 1,
          borderColor: colors.lineStrong,
        }}
      >
        {on && (
          <Icon name={indeterminate ? 'Minus' : 'Check'} size="xs" color={colors.textInverse} />
        )}
      </View>
      <View style={{ gap: 2 }}>
        <Text
          style={{
            fontSize: fontSize.md,
            fontWeight: fontWeight.medium,
            color: colors.textHeading,
          }}
        >
          {label}
        </Text>
        {description && (
          <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>{description}</Text>
        )}
      </View>
    </Pressable>
  );
});
