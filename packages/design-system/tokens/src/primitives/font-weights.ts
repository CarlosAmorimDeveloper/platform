// String values (not numbers) so the same constant is directly assignable to
// React Native's `fontWeight` style, which only accepts the string union.
export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeights = typeof fontWeights;
