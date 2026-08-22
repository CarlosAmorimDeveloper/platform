import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import { fontSize, fontWeight, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';
import { Button } from '../core/Button';

export interface ErrorViewProps {
  description: string;
  title?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ErrorView({
  description,
  title,
  icon = 'CircleAlert',
  actionLabel = 'Tentar novamente',
  onAction,
  style,
  testID,
}: ErrorViewProps) {
  const { colors } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[2],
          paddingHorizontal: space[6],
          paddingVertical: space[8],
        },
        style,
      ]}
    >
      <Icon name={icon} size="lg" color={vtColors.danger} />
      {title && (
        <Text
          style={{
            fontSize: fontSize.lg,
            fontWeight: fontWeight.semibold,
            color: colors.textHeading,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}
      <Text style={{ fontSize: fontSize.sm, color: vtColors.danger, textAlign: 'center' }}>
        {description}
      </Text>
      {onAction && (
        <Button variant="secondary" onPress={onAction} style={{ marginTop: space[4] }}>
          {actionLabel}
        </Button>
      )}
    </View>
  );
}
