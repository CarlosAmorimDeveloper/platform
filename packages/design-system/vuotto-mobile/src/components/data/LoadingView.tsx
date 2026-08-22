import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { LoadingIndicator } from './LoadingIndicator';

export interface LoadingViewProps {
  visible?: boolean;
  message?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function LoadingView({ visible = true, message, style, testID }: LoadingViewProps) {
  const { colors } = useTheme();
  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[3],
          paddingHorizontal: space[6],
          paddingVertical: space[8],
        },
        style,
      ]}
    >
      <LoadingIndicator testID={testID && `${testID}-indicator`} />
      {message && (
        <Text
          style={{
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
