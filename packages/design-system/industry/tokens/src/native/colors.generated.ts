// GENERATED FILE — do not edit by hand.
// Resolved from tokens/colors.css by scripts/build-native-tokens.mjs.
// Re-run `yarn build` after changing colors.css to regenerate this file.

export const color = {
  bg: '#14161a',
  surface: '#1c1f24',
  surface2: '#24282e',
  text: '#e6e9ec',
  accent: '#86a8cc',
  accent2: '#7cacc8',
  divider: 'rgba(230, 233, 236, 0.16)',
  dividerStrong: 'rgba(230, 233, 236, 0.30)',
} as const;

export const neutral = {
  '100': '#ebeff2',
  '200': '#d5d8db',
  '300': '#bbbec1',
  '400': '#a2a5a8',
  '500': '#898c90',
  '600': '#6f7275',
  '700': '#535659',
  '800': '#36383b',
  '900': '#1d2022',
} as const;

export const accentRamp = {
  '100': '#e5f0fc',
  '200': '#c7daee',
  '300': '#a6c1dd',
  '400': '#86a8cc',
  '500': '#6990b8',
  '600': '#527599',
  '700': '#3b5876',
  '800': '#263a4e',
  '900': '#14202d',
} as const;

export const accent2Ramp = {
  '100': '#e2f1fa',
  '200': '#c2dcec',
  '300': '#9fc4da',
  '400': '#7cacc8',
  '500': '#5d94b3',
  '600': '#467895',
  '700': '#315b72',
  '800': '#1f3c4c',
  '900': '#10222b',
} as const;

export const success = {
  '200': '#c5dfcf',
  '300': '#a1c9b0',
  '400': '#7fb294',
  '700': '#376048',
  '900': '#12241a',
} as const;

export const warning = {
  '200': '#e7d5b7',
  '300': '#d4ba8a',
  '400': '#ccac71',
  '700': '#675228',
  '900': '#281e0a',
} as const;

export const danger = {
  '200': '#f1cec9',
  '300': '#e5aea7',
  '400': '#d78f85',
  '700': '#7c433c',
  '900': '#321613',
} as const;

export const semanticColor = {
  success: '#7fb294',
  warning: '#ccac71',
  danger: '#d78f85',
  info: '#7cacc8',
} as const;

export const viz = {
  '1': '#7ea9d5',
  '2': '#63b3bc',
  '3': '#77b493',
  '4': '#b4a46a',
  '5': '#d19383',
  '6': '#b098cd',
  grid: 'rgba(230, 233, 236, 0.10)',
} as const;

// ── Light theme mirrors — same shape, resolved against `[data-theme='light']` ──

export const lightColor = {
  bg: '#f5f7f9',
  surface: '#fcfdff',
  surface2: '#f0f2f4',
  text: '#191b1d',
  accent: '#547596',
  accent2: '#4a7892',
  divider: 'rgba(25, 27, 29, 0.16)',
  dividerStrong: 'rgba(25, 27, 29, 0.30)',
} as const;

export const lightNeutral = {
  '100': '#1d2022',
  '200': '#36383b',
  '300': '#535659',
  '400': '#6f7275',
  '500': '#898c90',
  '600': '#a2a5a8',
  '700': '#bbbec1',
  '800': '#d5d8db',
  '900': '#ebeff2',
} as const;

export const lightAccentRamp = {
  '100': '#182029',
  '200': '#2a394a',
  '300': '#405870',
  '400': '#547596',
  '500': '#6990b8',
  '600': '#83a8cf',
  '700': '#a1c1e4',
  '800': '#c2daf5',
  '900': '#e0f1ff',
} as const;

export const lightAccent2Ramp = {
  '100': '#162127',
  '200': '#263b48',
  '300': '#395a6d',
  '400': '#4a7892',
  '500': '#5d94b3',
  '600': '#79accb',
  '700': '#99c5df',
  '800': '#bcddf1',
  '900': '#dcf2ff',
} as const;

export const lightSuccess = {
  '200': '#283e31',
  '300': '#3a5f4a',
  '400': '#4d7e62',
  '700': '#9ecaaf',
  '900': '#dff5e7',
} as const;

export const lightWarning = {
  '200': '#44361b',
  '300': '#695123',
  '400': '#8a6c32',
  '700': '#d3ba8e',
  '900': '#faedd5',
} as const;

export const lightDanger = {
  '200': '#4b302c',
  '300': '#754741',
  '400': '#9f5c54',
  '700': '#edaba1',
  '900': '#ffe4de',
} as const;

export const lightSemanticColor = {
  success: '#4d7e62',
  warning: '#8a6c32',
  danger: '#9f5c54',
  info: '#4a7892',
} as const;

export const lightViz = {
  '1': '#3e668f',
  '2': '#157079',
  '3': '#357153',
  '4': '#726328',
  '5': '#8b5243',
  '6': '#6e5788',
  grid: 'rgba(25, 27, 29, 0.10)',
} as const;

export const themeColor = { dark: color, light: lightColor } as const;
export type ThemeMode = keyof typeof themeColor;
