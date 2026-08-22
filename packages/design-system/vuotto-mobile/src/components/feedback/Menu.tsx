import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Dimensions, Modal, Pressable, Text, View } from 'react-native';
import { fontSize, radii, shadow, space } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface MenuItemOption {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: ReactNode;
  items: MenuItemOption[];
  testID?: string;
}

/** Anchored dropdown, positioned below and right-aligned to `anchor`. */
export function Menu({ visible, onDismiss, anchor, items, testID }: MenuProps) {
  const { colors } = useTheme();
  const anchorRef = useRef<View>(null);
  const [position, setPosition] = useState<{ top: number; right: number }>({
    top: 0,
    right: space[3],
  });

  useEffect(() => {
    if (!visible) return;
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get('window').width;
      setPosition({
        top: y + height + space[1],
        right: Math.max(windowWidth - (x + width), space[3]),
      });
    });
  }, [visible]);

  return (
    <>
      <View ref={anchorRef} collapsable={false}>
        {anchor}
      </View>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
        <Pressable testID={testID && `${testID}-backdrop`} onPress={onDismiss} style={{ flex: 1 }}>
          <View
            testID={testID}
            style={{
              position: 'absolute',
              top: position.top,
              right: position.right,
              minWidth: 200,
              borderRadius: radii.md,
              backgroundColor: colors.surfaceSolid,
              borderWidth: 1,
              borderColor: colors.lineStrong,
              paddingVertical: space[1],
              ...shadow.md,
            }}
          >
            {items.map((item) => (
              <Pressable
                key={item.label}
                disabled={item.disabled}
                onPress={item.disabled ? undefined : item.onPress}
                style={({ pressed }) => ({
                  paddingVertical: space[3],
                  paddingHorizontal: space[4],
                  backgroundColor: pressed ? colors.glass2 : 'transparent',
                  opacity: item.disabled ? 0.5 : 1,
                })}
              >
                <Text style={{ fontSize: fontSize.sm, color: colors.textPrimary }}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
