import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { alpha, color, fontFamily } from '@industry/tokens';

export interface ProgressProps {
  value?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Progress({
  value = 0,
  max = 100,
  label,
  showValue = true,
  style,
  testID,
}: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const width = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(width, { toValue: pct, duration: 240, useNativeDriver: false }).start();
  }, [pct, width]);

  return (
    <View style={style}>
      {label || showValue ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <Text style={{ fontFamily: fontFamily.body, fontSize: 11, color: alpha(color.text, 60) }}>
            {label}
          </Text>
          {showValue ? (
            <Text
              style={{ fontFamily: fontFamily.body, fontSize: 11, color: alpha(color.text, 60) }}
            >
              {Math.round(pct)}%
            </Text>
          ) : null}
        </View>
      ) : null}
      <View
        testID={testID}
        accessible
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max, now: value }}
        style={{ height: 4, backgroundColor: alpha(color.text, 12), overflow: 'hidden' }}
      >
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: color.accent,
            width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </View>
  );
}

export interface SpinnerProps {
  style?: StyleProp<ViewStyle>;
}

export function Spinner({ style }: SpinnerProps) {
  return (
    <ActivityIndicator
      animating
      size="small"
      color={color.accent}
      style={style}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
    />
  );
}
