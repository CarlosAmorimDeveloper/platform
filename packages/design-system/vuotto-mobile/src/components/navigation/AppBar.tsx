import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, fontSize, fontWeight, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

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

export function AppBar({ title, onBackPress, actions = [], style, testID }: AppBarProps) {
  const { colors } = useTheme();

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
          backgroundColor: colors.surfaceSolid,
          borderBottomWidth: 1,
          borderBottomColor: colors.lineHairline,
        },
        style,
      ]}
    >
      {onBackPress && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBackPress}
          hitSlop={8}
          style={{ padding: space[2] }}
          testID={testID ? `${testID}-back` : undefined}
        >
          <Icon name="ArrowLeft" size="md" color={colors.textHeading} />
        </Pressable>
      )}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.semibold,
          fontSize: fontSize.lg,
          color: colors.textHeading,
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
          <Icon name={action.icon} size="md" color={colors.textHeading} />
        </Pressable>
      ))}
    </View>
  );
}
