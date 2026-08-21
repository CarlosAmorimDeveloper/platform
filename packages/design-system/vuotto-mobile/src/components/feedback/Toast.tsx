import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, fontWeight, radii, shadow, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export type ToastTone = 'neutral' | 'success' | 'danger';

export interface ToastProps {
  tone?: ToastTone;
  title: string;
  /** Mono detail line — counts, timestamps, ids. */
  description?: string;
  action?: ReactNode;
  onDismiss?: () => void;
  /** Fires while the toast is held, pausing its auto-dismiss timer — the touch equivalent of hover. */
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Toast({
  tone = 'neutral',
  title,
  description,
  action,
  onDismiss,
  onPressIn,
  onPressOut,
  style,
}: ToastProps) {
  const { colors } = useTheme();
  const c =
    tone === 'success'
      ? vtColors.success
      : tone === 'danger'
        ? vtColors.danger
        : colors.textTertiary;
  const icon: IconName = tone === 'success' ? 'Check' : tone === 'danger' ? 'OctagonAlert' : 'Info';

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: space[3],
          minWidth: 280,
          maxWidth: 400,
          paddingVertical: space[3],
          paddingHorizontal: space[4],
          borderRadius: radii.sm,
          backgroundColor: colors.glass3,
          borderWidth: 1,
          borderColor: colors.lineStrong,
          ...shadow.md,
        },
        style,
      ]}
    >
      <Icon name={icon} size="sm" color={c} style={{ marginTop: 2 }} />
      <View style={{ gap: 2, flex: 1 }}>
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.semibold,
            fontSize: fontSize.sm,
            color: colors.textHeading,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.xs,
              color: colors.textTertiary,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {action}
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={onDismiss}
          hitSlop={8}
          style={{ padding: 2 }}
        >
          <Icon name="X" size="xs" color={colors.textTertiary} />
        </Pressable>
      )}
    </Pressable>
  );
}
