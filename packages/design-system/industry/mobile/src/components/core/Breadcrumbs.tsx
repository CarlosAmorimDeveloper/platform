import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { alpha, color, space } from '@industry/tokens';

export interface Crumb {
  label: string;
  onPress?: () => void;
}

export interface BreadcrumbsProps {
  items?: Crumb[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Breadcrumbs({ items = [], style, testID }: BreadcrumbsProps) {
  return (
    <View
      testID={testID}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: space[2], flexWrap: 'wrap' },
        style,
      ]}
    >
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const textStyle = { fontSize: 13, color: last ? color.text : alpha(color.text, 60) };
        return (
          <View
            key={item.label}
            style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}
          >
            {last || !item.onPress ? (
              <Text style={textStyle}>{item.label}</Text>
            ) : (
              <Pressable
                onPress={item.onPress}
                accessibilityRole="link"
                accessibilityLabel={item.label}
                testID={testID ? `${testID}-${item.label}` : undefined}
              >
                <Text style={textStyle}>{item.label}</Text>
              </Pressable>
            )}
            {!last ? <Text style={{ fontSize: 13, color: alpha(color.text, 40) }}>/</Text> : null}
          </View>
        );
      })}
    </View>
  );
}
