import { Modal, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, radii, shadow, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon } from '../core/Icon';

export interface DialogProps {
  open?: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Action row, right-aligned — usually two <Button>s. */
  footer?: ReactNode;
  onClose?: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Modal for decisions and short forms. RN's `Modal` (same primitive
 * `Select`/`SideNav` already use) is a native overlay — it isolates the
 * accessibility tree and blocks background interaction on its own, so
 * there's no mobile equivalent of the web version's hand-rolled focus trap
 * or scroll lock to build here.
 */
export function Dialog({
  open = true,
  title,
  description,
  children,
  footer,
  onClose,
  width = 460,
  style,
}: DialogProps) {
  const { colors } = useTheme();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: space[6],
          backgroundColor: colors.glassScrim,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            {
              width,
              maxWidth: '100%',
              padding: space[6],
              borderRadius: radii.lg,
              backgroundColor: colors.surfaceSolid,
              borderWidth: 1,
              borderColor: colors.lineStrong,
              gap: space[4],
              ...shadow.lg,
            },
            style,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: space[4] }}>
            <View style={{ gap: 6, flex: 1 }}>
              <Text
                style={{
                  fontFamily: fontFamily.display,
                  fontSize: fontSize.displaySm,
                  color: colors.textHeading,
                }}
              >
                {title}
              </Text>
              {description && (
                <Text
                  style={{
                    fontFamily: fontFamily.sans,
                    fontSize: fontSize.md,
                    color: colors.textSecondary,
                  }}
                >
                  {description}
                </Text>
              )}
            </View>
            {onClose && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                onPress={onClose}
                hitSlop={8}
                style={{ padding: 4 }}
              >
                <Icon name="X" size="sm" color={colors.textTertiary} />
              </Pressable>
            )}
          </View>
          {children}
          {footer && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: space[2] }}>
              {footer}
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
