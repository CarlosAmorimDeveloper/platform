import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { alpha, fontFamily, fontSize, fontWeight, radii, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

const TONES: Record<string, { c: string; icon: IconName }> = {
  info: { c: vtColors.cool, icon: 'Info' },
  success: { c: vtColors.success, icon: 'CircleCheck' },
  warning: { c: vtColors.warning, icon: 'TriangleAlert' },
  danger: { c: vtColors.danger, icon: 'OctagonAlert' },
};

export type BannerTone = keyof typeof TONES;

export interface BannerProps {
  tone?: BannerTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Banner({ tone = 'info', title, children, action, onDismiss, style }: BannerProps) {
  const { colors } = useTheme();
  const t = TONES[tone] ?? TONES.info!;

  return (
    <View
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={[
        {
          flexDirection: 'row',
          gap: space[3],
          alignItems: 'flex-start',
          padding: space[4],
          borderRadius: radii.md,
          backgroundColor: alpha(t.c, 10),
          borderWidth: 1,
          borderColor: alpha(t.c, 28),
        },
        style,
      ]}
    >
      <Icon name={t.icon} size="sm" color={t.c} style={{ marginTop: 1 }} />
      <View style={{ gap: 4, flex: 1 }}>
        {title && (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.md,
              color: colors.textHeading,
            }}
          >
            {title}
          </Text>
        )}
        {typeof children === 'string' ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontSize: fontSize.sm,
              color: colors.textSecondary,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {action && <View style={{ marginTop: 6 }}>{action}</View>}
      </View>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={onDismiss}
          hitSlop={8}
          style={{ padding: 2 }}
        >
          <Icon name="X" size="sm" color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}
