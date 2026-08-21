import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, fontWeight, radii, space, zIndex } from '@vuotto/tokens';
import { useTheme } from '../../theme';
import { Icon, type IconName } from '../core/Icon';

export interface SideNavItem {
  value: string;
  label: string;
  icon?: IconName;
  count?: number | string;
}

export interface SideNavGroup {
  label?: string;
  items: SideNavItem[];
}

export interface SideNavProps {
  groups?: SideNavGroup[];
  value?: string;
  onChange?: (value: string) => void;
  /** Usually a <Lockup />. */
  header?: ReactNode;
  footer?: ReactNode;
  width?: number;
  /** Drawer open state — phones are always "narrow", so this is the only render mode. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Primary console navigation, reimplemented as an always-drawer for mobile
 * (there's no "wide viewport" static-sidebar case the way there is on web).
 * RN's `Modal` already isolates the accessibility tree and handles the
 * back-button/gesture dismissal, so it substitutes for a hand-rolled focus
 * trap — no need to reimplement what `SideNav.tsx` (web) has to build by
 * hand for the same reason `Select`/mobile already uses `Modal` here.
 */
export function SideNav({
  groups = [],
  value,
  onChange,
  header,
  footer,
  width = 260,
  open = false,
  onOpenChange,
  style,
}: SideNavProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
    >
      <Pressable
        onPress={() => onOpenChange?.(false)}
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: colors.glassScrim,
          zIndex: zIndex.modal,
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ width, backgroundColor: colors.surfaceSolid }}
        >
          <ScrollView
            contentContainerStyle={[{ flexGrow: 1, gap: space[6], padding: space[5] }, style]}
          >
            {header}
            <View style={{ gap: space[6], flex: 1 }}>
              {groups.map((g, gi) => (
                <View key={g.label || gi} style={{ gap: 2 }}>
                  {g.label && (
                    <Text
                      style={{
                        paddingHorizontal: 10,
                        paddingBottom: 8,
                        fontFamily: fontFamily.mono,
                        fontSize: fontSize.xs,
                        textTransform: 'uppercase',
                        color: colors.textTertiary,
                      }}
                    >
                      {g.label}
                    </Text>
                  )}
                  {g.items.map((it) => {
                    const on = value === it.value;
                    return (
                      <Pressable
                        key={it.value}
                        accessibilityRole="button"
                        accessibilityState={{ selected: on }}
                        onPress={() => onChange?.(it.value)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: space[3],
                          height: 44,
                          paddingHorizontal: 10,
                          borderRadius: radii.sm,
                          backgroundColor: on ? colors.glass3 : 'transparent',
                          borderWidth: 1,
                          borderColor: on ? colors.lineHairline : 'transparent',
                        }}
                      >
                        {it.icon && (
                          <Icon
                            name={it.icon}
                            size="sm"
                            color={on ? colors.textHeading : colors.textSecondary}
                          />
                        )}
                        <Text
                          style={{
                            flex: 1,
                            fontFamily: fontFamily.sans,
                            fontWeight: fontWeight.medium,
                            fontSize: fontSize.sm,
                            color: on ? colors.textHeading : colors.textSecondary,
                          }}
                        >
                          {it.label}
                        </Text>
                        {it.count != null && (
                          <Text
                            style={{
                              fontFamily: fontFamily.mono,
                              fontSize: fontSize.xs,
                              color: colors.textTertiary,
                            }}
                          >
                            {it.count}
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
            {footer}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
