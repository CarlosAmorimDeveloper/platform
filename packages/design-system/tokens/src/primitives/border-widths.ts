// Values in px (unitless — consumers apply the unit)
export const borderWidths = {
  hairline: 1,
  thick: 2,
} as const;

export type BorderWidths = typeof borderWidths;
