// Stacking order, low to high. Mirrors MUI's own zIndex scale where a role
// overlaps (header≈appBar, overlay≈drawer, modal, toast≈snackbar) so web
// doesn't end up fighting values it already gets from MUI's defaults.
export const zIndices = {
  base: 0,
  dropdown: 1000,
  header: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
} as const;

export type ZIndices = typeof zIndices;
