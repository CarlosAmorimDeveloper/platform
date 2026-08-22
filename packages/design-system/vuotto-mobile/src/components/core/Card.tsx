import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import type { ReactNode } from 'react';
import { radii, shadow, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';

const PAD = { none: 0, sm: space[4], md: space[5], lg: space[8] };
const RADIUS = { sm: radii.sm, md: radii.md, lg: radii.lg, xl: radii.xl };

export type CardPadding = keyof typeof PAD;
export type CardRadius = keyof typeof RADIUS;

export interface CardProps {
  children?: ReactNode;
  padding?: CardPadding;
  radius?: CardRadius;
  /** Applies the `md` drop shadow. Only for surfaces that genuinely float. */
  elevated?: boolean;
  /** Renders as touchable, with a pressed-state surface raise. */
  interactive?: boolean;
  selected?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function Card({
  children,
  padding = 'md',
  radius = 'md',
  elevated = false,
  interactive = false,
  selected = false,
  onPress,
  style,
  testID,
  accessibilityLabel,
}: CardProps) {
  const { colors } = useTheme();

  const baseStyle = (raised: boolean): ViewStyle => ({
    padding: PAD[padding],
    borderRadius: RADIUS[radius],
    backgroundColor: selected ? colors.glass3 : raised ? colors.glass2 : colors.surfaceCard,
    borderWidth: 1,
    borderColor: raised ? colors.lineStrong : colors.lineHairline,
    ...(elevated ? shadow.md : {}),
  });

  if (interactive) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [baseStyle(selected || pressed), style]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle(selected), style]} testID={testID}>
      {children}
    </View>
  );
}
