import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, fontWeight, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';

const numberFormatter = new Intl.NumberFormat('pt-BR');

export interface StatProps {
  /** Mono uppercase eyebrow. */
  label: string;
  /** Rendered in the display serif. A `number` is formatted via `Intl.NumberFormat('pt-BR')`. */
  value: ReactNode | number;
  unit?: string;
  /** Change figure, e.g. "+12,4%". */
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  footnote?: string;
  style?: StyleProp<ViewStyle>;
}

export function Stat({ label, value, unit, delta, trend = 'flat', footnote, style }: StatProps) {
  const { colors } = useTheme();
  const tone =
    trend === 'up' ? vtColors.success : trend === 'down' ? vtColors.danger : colors.textTertiary;
  const renderedValue = typeof value === 'number' ? numberFormatter.format(value) : value;

  return (
    <View style={[{ gap: space[2] }, style]}>
      <Text
        style={{
          fontFamily: fontFamily.mono,
          fontSize: fontSize.xs,
          textTransform: 'uppercase',
          color: colors.textTertiary,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
        {typeof renderedValue === 'string' || typeof renderedValue === 'number' ? (
          <Text
            style={{
              fontFamily: fontFamily.display,
              fontSize: fontSize.displaySm,
              color: colors.textHeading,
            }}
          >
            {renderedValue}
          </Text>
        ) : (
          renderedValue
        )}
        {unit && (
          <Text
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.sm,
              color: colors.textTertiary,
            }}
          >
            {unit}
          </Text>
        )}
        {delta && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 4 }}>
            <Icon
              name={trend === 'down' ? 'TrendingDown' : trend === 'up' ? 'TrendingUp' : 'Minus'}
              size="xs"
              color={tone}
            />
            <Text
              style={{
                fontFamily: fontFamily.mono,
                fontSize: fontSize.xs,
                fontWeight: fontWeight.medium,
                color: tone,
              }}
            >
              {delta}
            </Text>
          </View>
        )}
      </View>
      {footnote && (
        <Text
          style={{ fontFamily: fontFamily.mono, fontSize: fontSize.xs, color: colors.textTertiary }}
        >
          {footnote}
        </Text>
      )}
    </View>
  );
}
