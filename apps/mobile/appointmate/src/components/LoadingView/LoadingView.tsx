import { Text, View } from 'react-native';
import { Spinner } from '@industry/mobile';
import { alpha, color, fontSize, space } from '@industry/tokens';

export interface LoadingViewProps {
  message?: string;
  testID?: string;
}

export function LoadingView({ message, testID }: LoadingViewProps) {
  return (
    <View
      testID={testID}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[3],
        paddingHorizontal: space[6],
        paddingVertical: space[8],
      }}
    >
      <Spinner />
      {message ? (
        <Text
          style={{
            fontSize: fontSize.body,
            color: alpha(color.text, 70),
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
