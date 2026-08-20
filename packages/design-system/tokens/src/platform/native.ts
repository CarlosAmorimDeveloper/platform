import { colors } from '../primitives';
import type { ElevationLevel } from '../semantic';

// React Native has no unitless line-height — it's an absolute px number.
// The shared token stays the ratio (`lineHeights.normal`, etc.); this just
// resolves it against whichever fontSize step the caller is using.
export function resolveLineHeight(fontSize: number, ratio: number): number {
  return Math.round(fontSize * ratio);
}

// Same issue as line-height: RN's `letterSpacing` is an absolute px number,
// not an em ratio like CSS `letter-spacing` accepts.
export function resolveLetterSpacing(fontSize: number, ratio: number): number {
  return Math.round(fontSize * ratio * 100) / 100;
}

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  elevation: number;
}

const ELEVATION_NATIVE_PARAMS: Record<
  Exclude<ElevationLevel, 0>,
  { offsetY: number; shadowRadius: number; shadowOpacity: number; elevation: number }
> = {
  1: { offsetY: 1, shadowRadius: 3, shadowOpacity: 0.08, elevation: 2 },
  2: { offsetY: 2, shadowRadius: 6, shadowOpacity: 0.12, elevation: 4 },
  3: { offsetY: 4, shadowRadius: 12, shadowOpacity: 0.16, elevation: 8 },
};

// Resolves an abstract elevation level (POR-80) to RN's two parallel shadow
// systems at once: shadowOffset/shadowRadius/shadowOpacity for iOS,
// elevation for Android. Same shadow color as the web adapter's `boxShadow`.
export function shadowStyle(level: ElevationLevel): ShadowStyle {
  if (level === 0) {
    return {
      shadowColor: colors.neutral[1000],
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 0,
      shadowOpacity: 0,
      elevation: 0,
    };
  }
  const { offsetY, shadowRadius, shadowOpacity, elevation } = ELEVATION_NATIVE_PARAMS[level];
  return {
    shadowColor: colors.neutral[1000],
    shadowOffset: { width: 0, height: offsetY },
    shadowRadius,
    shadowOpacity,
    elevation,
  };
}
