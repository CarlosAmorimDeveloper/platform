import { View, Text } from 'react-native';
import type { ReactNode } from 'react';
import {
  alpha,
  fontSize,
  fontWeight,
  radii,
  resolveLetterSpacing,
  space,
  vtColors,
} from '@vuotto/tokens';
import { Icon, type IconName } from './Icon';

const TONES = {
  neutral: vtColors.mute,
  success: vtColors.success,
  warning: vtColors.warning,
  danger: vtColors.danger,
  info: vtColors.cool,
};

export type BadgeTone = keyof typeof TONES;

export interface BadgeProps {
  children?: ReactNode;
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  icon?: IconName;
}

export function Badge({ children, tone = 'neutral', dot = false, icon }: BadgeProps) {
  const c = TONES[tone] ?? TONES.neutral;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[2],
        height: 22,
        paddingHorizontal: 8,
        borderRadius: radii.xs,
        backgroundColor: alpha(c, 14),
        borderWidth: 1,
        borderColor: alpha(c, 30),
        alignSelf: 'flex-start',
      }}
    >
      {dot && <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: c }} />}
      {icon && <Icon name={icon} size="xs" color={c} />}
      {typeof children === 'string' ? (
        <Text
          style={{
            color: c,
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            letterSpacing: resolveLetterSpacing(fontSize.xs, 0.02),
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
