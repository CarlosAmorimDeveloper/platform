import { forwardRef } from 'react';
import {
  Pressable,
  Text,
  type View,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { fontSize, fontWeight, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface FileDropProps {
  label?: string;
  /** Mono constraint line, e.g. "PNG, JPG ou PDF até 10 MB". */
  hint?: string;
  icon?: IconName;
  /**
   * There's no OS-level drag-and-drop or clipboard file paste on a
   * touchscreen — this component is presentational; `onPress` is where the
   * app wires up its own picker (camera roll, document picker, etc.),
   * whichever library that ends up being isn't this design system's call.
   */
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Dashed drop zone for uploads and photo capture fields — the only dashed border in the system. */
export const FileDrop = forwardRef<View, FileDropProps>(function FileDrop(
  {
    label = 'Toque para escolher um arquivo',
    hint = 'PNG, JPG ou PDF até 10 MB',
    icon = 'Upload',
    onPress,
    disabled = false,
    style,
  },
  ref,
) {
  const { colors } = useTheme();

  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[2],
          paddingVertical: space[8],
          paddingHorizontal: space[5],
          borderRadius: 14,
          backgroundColor: colors.glass1,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: colors.lineStrong,
          opacity: disabled ? 0.42 : 1,
        },
        style,
      ]}
    >
      <Icon name={icon} size="lg" color={colors.textTertiary} />
      <Text
        style={{
          fontSize: fontSize.md,
          fontWeight: fontWeight.medium,
          color: colors.textHeading,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary, textAlign: 'center' }}>
        {hint}
      </Text>
    </Pressable>
  );
});
