export interface DropShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  /** Approximate — Android's `elevation` has no color/blur control, this is
   * a rough monochrome stand-in, not a faithful port of the web shadow. */
  elevation: number;
}

// Resolved from tokens/effects.css. RN's shadow* props support one layer —
// the hairline ring each web shadow carries alongside it
// (`0 0 0 1px color-mix(... var(--color-text) N%, transparent)`) has no RN
// equivalent; approximate it separately with `borderWidth: 1` and
// `borderColor: color.divider` (or `color.dividerStrong`) on the same element.
export const shadow: Record<'sm' | 'md' | 'lg', DropShadow> = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowOpacity: 0.45,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 44,
    shadowOpacity: 0.55,
    elevation: 18,
  },
};
