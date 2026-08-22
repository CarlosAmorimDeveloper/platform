import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, fontWeight, radii, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface ChipProps {
  children: string;
  /** Single-choice selection state (unlike `Tag`'s removable filter role). */
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Chip({
  children,
  selected = false,
  onPress,
  disabled = false,
  style,
  testID,
}: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[
        {
          height: 32,
          paddingHorizontal: space[3],
          borderRadius: radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? colors.glass3 : colors.glass1,
          borderWidth: 1,
          borderColor: selected ? colors.lineStrong : colors.lineHairline,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: fontSize.sm,
          fontWeight: selected ? fontWeight.semibold : fontWeight.medium,
          color: selected ? colors.textHeading : colors.textSecondary,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}
