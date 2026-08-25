import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_COLOR = alpha(color.text, 55);

const CORNER_POSITIONS: Record<CornerPosition, ViewStyle> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  return (
    <View
      testID={`frame-corner-${position}`}
      pointerEvents="none"
      style={[{ position: 'absolute', width: 11, height: 11 }, CORNER_POSITIONS[position]]}
    >
      <View
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: CORNER_COLOR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          backgroundColor: CORNER_COLOR,
        }}
      />
    </View>
  );
}

export interface FrameProps {
  marks?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Frame({ marks = true, children, style }: FrameProps) {
  return (
    <View style={[{ borderWidth: 1, borderColor: color.divider, borderRadius: 0 }, style]}>
      {marks ? (
        <>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </>
      ) : null}
      {children}
    </View>
  );
}
