import { Pressable, Text, View, type GestureResponderEvent } from 'react-native';
import type { ReactNode } from 'react';
import { fontSize, fontWeight, radii } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from './Icon';

export interface TagProps {
  children?: ReactNode;
  /** Selected filter state. */
  active?: boolean;
  /** Renders a trailing remove affordance — a nested Pressable, which RN's
   * responder system routes independently of the parent's onPress. */
  onRemove?: (e: GestureResponderEvent) => void;
  onPress?: (e: GestureResponderEvent) => void;
}

export function Tag({ children, active = false, onRemove, onPress }: TagProps) {
  const { colors } = useTheme();
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: 28,
        paddingHorizontal: onRemove ? 6 : 12,
        paddingStart: onRemove ? 12 : 12,
        borderRadius: radii.pill,
        backgroundColor: active ? colors.glass3 : colors.glass1,
        borderWidth: 1,
        borderColor: active ? colors.lineStrong : colors.lineHairline,
      }}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            color: active ? colors.textHeading : colors.textSecondary,
            fontSize: fontSize.sm,
            fontWeight: fontWeight.medium,
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remover"
          onPress={onRemove}
          hitSlop={8}
          style={{ padding: 2 }}
        >
          <Icon name="X" size="xs" color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}
