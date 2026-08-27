import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_POSITIONS: Record<CornerPosition, ViewStyle> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  // Resolved on every render, not hoisted to module scope, so this picks up
  // a future theme/dark-mode change to color.text instead of staying frozen
  // at whatever it resolved to on first import.
  const cornerColor = alpha(color.text, 55);

  return (
    <View
      testID={`frame-corner-${position}`}
      pointerEvents="none"
      style={[
        { position: 'absolute', width: 11, height: 11, zIndex: 1 },
        CORNER_POSITIONS[position],
      ]}
    >
      <View
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: cornerColor,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          backgroundColor: cornerColor,
        }}
      />
    </View>
  );
}

export function BlueprintMarks() {
  return (
    <>
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </>
  );
}
