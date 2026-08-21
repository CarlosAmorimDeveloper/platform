import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, View, type StyleProp, type ViewStyle } from 'react-native';
import { radii } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  /** Multiple stacked bars; the last is shortened. */
  lines?: number;
  style?: StyleProp<ViewStyle>;
}

function ShimmerBar({
  width,
  height,
  radius,
  reduceMotion,
}: {
  width: number | `${number}%`;
  height: number;
  radius: number;
  reduceMotion: boolean;
}) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.45, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: colors.glass3,
        opacity: reduceMotion ? 1 : opacity,
      }}
    />
  );
}

/**
 * RN has no CSS `prefers-reduced-motion` media query — `AccessibilityInfo`
 * is the platform's equivalent, read once and subscribed to for live
 * changes (mirrors the async-load pattern in `useTheme`).
 */
export function Skeleton({
  width = '100%',
  height = 12,
  radius = radii.xs,
  lines = 1,
  style,
}: SkeletonProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  return (
    <View style={[{ gap: 8 }, style]}>
      {Array.from({ length: lines }, (_, i) => (
        <ShimmerBar
          key={i}
          width={lines > 1 && i === lines - 1 ? '62%' : width}
          height={height}
          radius={radius}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}
