// Values in px (unitless — consumers apply the unit). Web-only: the one
// token group that doesn't need a mobile equivalent (POR-81).
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export type Breakpoints = typeof breakpoints;
