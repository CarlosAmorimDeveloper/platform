// With fully transparent as the other side, CSS color-mix() (any interpolation
// space) reduces to "COLOR at X% alpha" — this is the runtime version of that,
// for values the generator doesn't precompute.
export function alpha(hexColor: string, percent: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}
