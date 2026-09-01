import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { alpha, color, fontFamily, fontWeight, shadow, space } from '@industry/tokens';

export interface SheetProps {
  open?: boolean;
  title?: ReactNode;
  onDismiss?: () => void;
  /** Action row pinned under the content. */
  actions?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Bottom sheet — the mobile counterpart of the dialog. */
export function Sheet({
  open = true,
  title,
  onDismiss,
  actions,
  children,
  style,
  testID,
}: SheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        testID={testID ? `${testID}-backdrop` : undefined}
        onPress={onDismiss}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: alpha(color.bg, 60) }}
      >
        <View
          testID={testID}
          onStartShouldSetResponder={() => true}
          style={[
            {
              gap: space[3],
              paddingHorizontal: space[4],
              paddingTop: space[3],
              paddingBottom: space[6] + insets.bottom,
              backgroundColor: color.surface,
              borderTopWidth: 1,
              borderTopColor: color.dividerStrong,
            },
            shadow.lg,
            style,
          ]}
        >
          <View
            style={{
              width: 44,
              height: 3,
              backgroundColor: color.dividerStrong,
              alignSelf: 'center',
            }}
          />
          {title ? (
            <Text
              style={{
                fontFamily: fontFamily.heading,
                fontWeight: fontWeight.heading,
                fontSize: 21,
                color: color.text,
              }}
            >
              {title}
            </Text>
          ) : null}
          {children}
          {actions}
        </View>
      </Pressable>
    </Modal>
  );
}
