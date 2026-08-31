import { View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@industry/mobile';
import { space } from '@industry/tokens';

export interface BottomBarProps {
  children: ReactNode;
  testID?: string;
}

/** Fixed action bar below the scrollable content, per the Industry "barra de ação inferior" rule. */
export function BottomBar({ children, testID }: BottomBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        gap: space[3],
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        backgroundColor: colors.bg,
        paddingTop: space[3],
        paddingHorizontal: space[6],
        paddingBottom: 20 + insets.bottom,
      }}
    >
      {children}
    </View>
  );
}
