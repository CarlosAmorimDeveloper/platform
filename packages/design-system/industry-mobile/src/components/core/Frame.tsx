import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color } from '@industry/tokens';
import { BlueprintMarks } from './BlueprintMarks';

export interface FrameProps {
  marks?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Frame({ marks = true, children, style }: FrameProps) {
  return (
    <View style={[{ borderWidth: 1, borderColor: color.divider, borderRadius: 0 }, style]}>
      {marks ? <BlueprintMarks /> : null}
      {children}
    </View>
  );
}
