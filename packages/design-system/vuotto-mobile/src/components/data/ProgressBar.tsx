import { useEffect, useRef } from 'react';
import { Animated, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, radii, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  /** Mono label above the track. */
  label?: string;
  showValue?: boolean;
  tone?: 'neutral' | 'cool' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = false,
  tone = 'neutral',
  size = 'md',
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const width = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(width, { toValue: pct, duration: 260, useNativeDriver: false }).start();
  }, [pct, width]);

  const fill =
    tone === 'success'
      ? vtColors.success
      : tone === 'warning'
        ? vtColors.warning
        : tone === 'danger'
          ? vtColors.danger
          : tone === 'cool'
            ? vtColors.cool
            : vtColors.white;

  return (
    <View style={[{ gap: 6 }, style]}>
      {(label || showValue) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {label && (
            <Text style={{ fontSize: fontSize.xs, color: colors.textTertiary }}>{label}</Text>
          )}
          {showValue && (
            <Text style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
              {Math.round(pct)}%
            </Text>
          )}
        </View>
      )}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
        style={{
          height: size === 'sm' ? 4 : 6,
          borderRadius: radii.pill,
          backgroundColor: colors.glass3,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            borderRadius: radii.pill,
            backgroundColor: fill,
            width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </View>
  );
}
