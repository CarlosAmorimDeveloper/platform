export function px(value: number): string {
  return `${value}px`;
}

export function rem(value: number, base = 16): string {
  return `${value / base}rem`;
}
