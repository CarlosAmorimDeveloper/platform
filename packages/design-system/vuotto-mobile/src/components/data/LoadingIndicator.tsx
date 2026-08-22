import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

export interface LoadingIndicatorProps {
  visible?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function LoadingIndicator({
  visible = true,
  size = 'large',
  color,
  style,
  testID,
}: LoadingIndicatorProps) {
  const { colors } = useTheme();
  if (!visible) return null;
  return (
    <ActivityIndicator
      testID={testID}
      animating
      size={size}
      color={color ?? colors.textSecondary}
      style={style}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
    />
  );
}
