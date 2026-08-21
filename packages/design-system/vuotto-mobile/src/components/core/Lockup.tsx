import { Text, View } from 'react-native';
import type { ReactElement } from 'react';
import { fontFamily, fontWeight, letterSpacing } from '@vuotto/tokens';
import { useTheme } from '../../theme';

const SCALE = { sm: 0.8, md: 1, lg: 1.5 };

export type LockupSize = keyof typeof SCALE;

export interface LockupProps {
  size?: LockupSize;
  /** Stacks "TECH" under "Vuotto" instead of beside it. */
  stacked?: boolean;
  /**
   * No logo symbol exists yet (readme.md: "Envie um SVG e ele substitui esse
   * lockup"). When given, this replaces the type lockup entirely.
   */
  logo?: ReactElement;
}

/** Vuotto Tech wordmark. No logo symbol exists — the lockup is type only. */
export function Lockup({ size = 'md', stacked = false, logo }: LockupProps) {
  const { colors } = useTheme();

  if (logo) return logo;

  const scale = SCALE[size];
  return (
    <View
      style={{
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'baseline',
        gap: stacked ? 2 : 8,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.display,
          fontWeight: fontWeight.regular,
          fontSize: 22 * scale,
          color: colors.textHeading,
          letterSpacing: -0.02 * 22 * scale,
        }}
      >
        Vuotto
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.mono,
          fontWeight: fontWeight.medium,
          fontSize: 10 * scale,
          color: colors.textTertiary,
          letterSpacing: letterSpacing.label * 10 * scale,
          textTransform: 'uppercase',
        }}
      >
        Tech
      </Text>
    </View>
  );
}
