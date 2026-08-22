import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, radii, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  /** Describe the next step, not the absence. */
  body?: string;
  /** Usually a <Button>. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EmptyState({
  icon = 'Inbox',
  title,
  body,
  action,
  style,
  testID,
}: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View
      testID={testID}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[3],
          paddingVertical: space[12],
          paddingHorizontal: space[6],
        },
        style,
      ]}
    >
      <View
        style={{
          width: 48,
          height: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.md,
          backgroundColor: colors.glass2,
          borderWidth: 1,
          borderColor: colors.lineHairline,
        }}
      >
        <Icon name={icon} size="lg" color={colors.textTertiary} />
      </View>
      <Text
        style={{
          fontFamily: fontFamily.display,
          fontSize: fontSize.displaySm,
          color: colors.textHeading,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {body && (
        <Text
          style={{
            maxWidth: 320,
            fontSize: fontSize.md,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {body}
        </Text>
      )}
      {action && <View style={{ marginTop: space[2] }}>{action}</View>}
    </View>
  );
}
