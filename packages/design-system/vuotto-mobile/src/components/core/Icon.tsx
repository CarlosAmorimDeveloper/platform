import type { StyleProp, ViewStyle } from 'react-native';
import * as icons from 'lucide-react-native/icons';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;
export type IconName = keyof typeof icons;

export interface IconProps {
  /** Lucide icon name, PascalCase (e.g. "ArrowRight", "ListChecks"). */
  name: IconName;
  /** xs=14 sm=16 md=20 lg=24, or an explicit px number. */
  size?: IconSize;
  color: string;
  /** Defaults to 1.5 (2 at 14px). Never heavier than 2. */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  /** Only pass this when the icon alone conveys meaning. */
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 'sm',
  color,
  strokeWidth,
  style,
  accessibilityLabel,
}: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const resolvedStrokeWidth = strokeWidth ?? (px <= 14 ? 2 : 1.5);
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      size={px}
      color={color}
      strokeWidth={resolvedStrokeWidth}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
    />
  );
}
