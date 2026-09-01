import { Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { alpha, color, fontFamily, fontWeight, space } from '@industry/tokens';

export interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  /** Usually a primary `<Button>`. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EmptyState({ icon, title, body, action, style, testID }: EmptyStateProps) {
  return (
    <View
      testID={testID}
      style={[
        {
          alignItems: 'center',
          gap: space[3],
          paddingVertical: space[12],
          paddingHorizontal: space[6],
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: color.divider,
        },
        style,
      ]}
    >
      {icon ? <View style={{ opacity: 0.8 }}>{icon}</View> : null}
      {title ? (
        <Text
          style={{
            fontFamily: fontFamily.heading,
            fontWeight: fontWeight.heading,
            fontSize: 21,
            textAlign: 'center',
            color: color.text,
          }}
        >
          {title}
        </Text>
      ) : null}
      {body ? (
        <Text style={{ fontSize: 14, textAlign: 'center', color: alpha(color.text, 60) }}>
          {body}
        </Text>
      ) : null}
      {action}
    </View>
  );
}
