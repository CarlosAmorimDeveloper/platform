import type { StyleProp, ViewStyle } from 'react-native';
// react-native-svg has no bundler-level dynamic `import()` code-splitting
// path the way lucide-react/dynamic does on web (Metro doesn't split per
// dynamic import the way Vite/webpack do) — lucide-react-native's own docs
// recommend against a name-lookup wrapper for exactly this reason ("importing
// all icons increases build size significantly"). This wrapper exists anyway
// to keep the same `<Icon name="..." />` call across web and mobile; the
// bundle-size tradeoff is real and worth knowing about, not something this
// file can route around.
import * as icons from 'lucide-react-native/icons';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;
export type IconName = keyof typeof icons;

export interface IconProps {
  /** Lucide icon name, PascalCase (e.g. "ArrowRight", "ListChecks") — unlike
   * the web wrapper, lucide-react-native's own name casing, not kebab-case. */
  name: IconName;
  /** xs=14 sm=16 md=20 lg=24, or an explicit px number. */
  size?: IconSize;
  /**
   * No `currentColor` equivalent exists in React Native — there's no CSS
   * cascade for an SVG-rendered icon to inherit from, so this is required
   * rather than defaulted, unlike the web `Icon`.
   */
  color: string;
  /** Defaults to 1.5 (2 at 14px). Never heavier than 2. */
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * Only pass this when the icon alone conveys meaning (e.g. inside an
   * icon-only button). RN's accessibility tree doesn't expose plain SVG
   * content by default the way the DOM does, so there's no `aria-hidden`
   * equivalent to set for the decorative case — omitting this prop already
   * is the decorative state.
   */
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
