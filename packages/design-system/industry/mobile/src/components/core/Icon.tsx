import type { StyleProp, ViewStyle } from 'react-native';
import * as icons from 'lucide-react-native/icons';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;
export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 'sm',
  color,
  strokeWidth = 1.5,
  style,
  accessibilityLabel,
}: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      size={px}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
    />
  );
}
