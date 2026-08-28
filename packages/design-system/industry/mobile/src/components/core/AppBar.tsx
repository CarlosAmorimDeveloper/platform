import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { color, fontFamily, fontSize, fontWeight, space } from '@industry/tokens';
import { Icon, type IconName } from './Icon';

export interface AppBarAction {
  icon: IconName;
  onPress: () => void;
  /** Required — becomes accessibilityLabel. */
  label: string;
  testID?: string;
}

export interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  actions?: AppBarAction[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Top navigation bar — title with an optional back button and trailing icon actions. */
export function AppBar({ title, onBackPress, actions = [], style, testID }: AppBarProps) {
  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[3],
          height: 56,
          paddingHorizontal: space[3],
          backgroundColor: color.surface,
          borderBottomWidth: 1,
          borderBottomColor: color.divider,
        },
        style,
      ]}
    >
      {onBackPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBackPress}
          hitSlop={8}
          style={{ padding: space[2] }}
          testID={testID ? `${testID}-back` : undefined}
        >
          <Icon name="ArrowLeft" size="md" color={color.text} />
        </Pressable>
      ) : null}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: fontFamily.heading,
          fontWeight: fontWeight.heading,
          fontSize: fontSize.h5,
          color: color.text,
        }}
      >
        {title}
      </Text>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={action.onPress}
          hitSlop={8}
          style={{ padding: space[2] }}
          testID={action.testID}
        >
          <Icon name={action.icon} size="md" color={color.text} />
        </Pressable>
      ))}
    </View>
  );
}
