// Mirrors the reasoning already used to resolve `color-mix(in oklab, COLOR
// X%, transparent)` in colors.generated.ts and effects/shadows: with fully
// transparent as the other side, premultiplied-alpha interpolation reduces
// to "COLOR at X% alpha" — this is the runtime version of that, for
// components that need a tone-tinted translucent fill the generator didn't
// precompute (e.g. Badge's per-tone background/border at arbitrary percents).
export function alpha(hexColor: string, percent: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}
