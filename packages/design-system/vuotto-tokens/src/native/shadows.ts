import { vtColors } from './colors.generated';

function hexToRgba(hex: string, alphaPercent: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(alphaPercent / 100).toFixed(2)})`;
}

export interface DropShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  /** Approximate — Android's `elevation` has no color/blur control, this is
   * a rough monochrome stand-in, not a faithful port of the web shadow. */
  elevation: number;
}

// Resolved from tokens/effects.css. RN's shadow* props have no `spread`
// parameter (unlike CSS box-shadow's 4th length) — --shadow-md/lg's negative
// spread is dropped, approximated by the blur radius alone.
export const shadow: Record<'sm' | 'md' | 'lg', DropShadow> = {
  sm: {
    shadowColor: vtColors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 2,
  },
  md: {
    shadowColor: vtColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.55,
    elevation: 8,
  },
  lg: {
    shadowColor: vtColors.black,
    shadowOffset: { width: 0, height: 24 },
    shadowRadius: 64,
    shadowOpacity: 0.7,
    elevation: 16,
  },
};

// `--shadow-glow` (cool-tinted, 0 offset). Only renders as specified on
// iOS — Android's `elevation` can't be tinted, so `elevation` here is a
// plain monochrome fallback, not the cool glow.
export const glow: DropShadow = {
  shadowColor: vtColors.cool,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 32,
  shadowOpacity: 0.4,
  elevation: 8,
};

// `--shadow-focus` is a solid 3px ring with no blur — closer to a border
// than a shadow, and RN's shadow* props can't render a spread-only ring
// reliably. Render it as `borderWidth: 3, borderColor: focusRingColor`
// instead of trying to force it through shadow props.
export const focusRingColor = hexToRgba(vtColors.white, 22);

// `--shadow-inset-top` has no RN equivalent at all — RN's shadow props are
// always cast outward, never inset. The signature "glass edge" highlight
// needs a different technique on native (e.g. a 1px absolutely-positioned
// View along the top edge), not a token value.
