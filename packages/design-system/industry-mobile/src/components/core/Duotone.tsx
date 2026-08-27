import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

export interface DuotoneProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Duotone({ children, style }: DuotoneProps) {
  // Resolved on every render, not hoisted to module scope, so this picks up
  // a future theme/dark-mode change to color.accent instead of staying
  // frozen at whatever it resolved to on first import.
  const overlayColor = alpha(color.accent, 55);

  return (
    <View style={[{ position: 'relative', overflow: 'hidden' }, style]}>
      {children}
      <View
        testID="duotone-overlay"
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlayColor,
        }}
      />
    </View>
  );
}
