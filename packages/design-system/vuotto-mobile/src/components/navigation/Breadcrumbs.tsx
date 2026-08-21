import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { fontFamily, fontSize } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface Crumb {
  label: string;
  /** RN has no anchor/`href` semantics — navigation is handled imperatively. */
  onPress?: () => void;
}

export interface BreadcrumbsProps {
  items?: Crumb[];
  style?: StyleProp<ViewStyle>;
}

export function Breadcrumbs({ items = [], style }: BreadcrumbsProps) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const textStyle = {
          fontFamily: fontFamily.mono,
          fontSize: fontSize.sm,
          color: last ? colors.textHeading : colors.textTertiary,
        };
        return (
          <View key={it.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {last || !it.onPress ? (
              <Text style={textStyle}>{it.label}</Text>
            ) : (
              <Pressable onPress={it.onPress} accessibilityRole="link">
                <Text style={textStyle}>{it.label}</Text>
              </Pressable>
            )}
            {!last && (
              <Text
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: fontSize.xs,
                  color: colors.textTertiary,
                }}
              >
                /
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
