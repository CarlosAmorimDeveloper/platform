// These color values mirror src/tokens/colors.css by hand — this script does not
// parse the CSS. Keep the two in sync manually whenever one changes.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatHex, oklch } from 'culori';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'native');
mkdirSync(outDir, { recursive: true });

function hex(l, c, h) {
  return formatHex(oklch({ mode: 'oklch', l, c, h }));
}

function alpha(hexColor, percent) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}

const darkText = '#e6e9ec';
const color = {
  bg: '#14161a',
  surface: '#1c1f24',
  surface2: '#24282e',
  text: darkText,
  accent: hex(0.72, 0.065, 250),
  accent2: hex(0.72, 0.065, 235),
  divider: alpha(darkText, 16),
  dividerStrong: alpha(darkText, 30),
};

const steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const rampL = {
  100: 0.95,
  200: 0.88,
  300: 0.8,
  400: 0.72,
  500: 0.64,
  600: 0.55,
  700: 0.45,
  800: 0.34,
  900: 0.24,
};
// Steps 100–900 read light→dark. Light theme inverts the pairing (100↔900,
// 200↔800, …, 500 stays put) so every component that reads a specific step
// directly (e.g. `danger['300']` for error text) stays legible without any
// component change — see colors.css's `[data-theme='light']` comment for
// the full rationale, this mirrors it value-for-value.
const lightRampL = Object.fromEntries(steps.map((s) => [s, rampL[1000 - s]]));
const accentC = {
  100: 0.02,
  200: 0.035,
  300: 0.05,
  400: 0.065,
  500: 0.075,
  600: 0.07,
  700: 0.06,
  800: 0.045,
  900: 0.03,
};

const neutral = Object.fromEntries(steps.map((s) => [s, hex(rampL[s], 0.006, 250)]));
const accentRamp = Object.fromEntries(steps.map((s) => [s, hex(rampL[s], accentC[s], 250)]));
const accent2Ramp = Object.fromEntries(steps.map((s) => [s, hex(rampL[s], accentC[s], 235)]));

const success = {
  200: hex(0.88, 0.035, 158),
  300: hex(0.8, 0.055, 158),
  400: hex(0.72, 0.07, 158),
  700: hex(0.45, 0.06, 158),
  900: hex(0.24, 0.03, 158),
};
const warning = {
  200: hex(0.88, 0.045, 82),
  300: hex(0.8, 0.07, 82),
  400: hex(0.76, 0.085, 82),
  700: hex(0.45, 0.065, 82),
  900: hex(0.24, 0.035, 82),
};
const danger = {
  200: hex(0.88, 0.04, 28),
  300: hex(0.8, 0.065, 28),
  400: hex(0.72, 0.09, 28),
  700: hex(0.45, 0.08, 28),
  900: hex(0.24, 0.045, 28),
};

const semanticColor = {
  success: success[400],
  warning: warning[400],
  danger: danger[400],
  info: accent2Ramp[400],
};

const viz = {
  1: hex(0.72, 0.08, 250),
  2: hex(0.72, 0.08, 205),
  3: hex(0.72, 0.08, 160),
  4: hex(0.72, 0.08, 95),
  5: hex(0.72, 0.08, 35),
  6: hex(0.72, 0.08, 305),
  grid: alpha(darkText, 10),
};

// ── Light theme (tokens/colors.css's `[data-theme='light']` block) ──
const lightText = hex(0.22, 0.006, 250);
const lightColor = {
  bg: hex(0.975, 0.003, 250),
  surface: hex(0.995, 0.002, 250),
  surface2: hex(0.96, 0.004, 250),
  text: lightText,
  accent: hex(0.55, 0.065, 250),
  accent2: hex(0.55, 0.065, 235),
  divider: alpha(lightText, 16),
  dividerStrong: alpha(lightText, 30),
};

const lightNeutral = Object.fromEntries(steps.map((s) => [s, hex(lightRampL[s], 0.006, 250)]));
const lightAccentRamp = Object.fromEntries(
  steps.map((s) => [s, hex(lightRampL[s], accentC[s], 250)]),
);
const lightAccent2Ramp = Object.fromEntries(
  steps.map((s) => [s, hex(lightRampL[s], accentC[s], 235)]),
);

const lightSuccess = {
  200: hex(lightRampL[200], 0.035, 158),
  300: hex(lightRampL[300], 0.055, 158),
  400: hex(lightRampL[400], 0.07, 158),
  700: hex(lightRampL[700], 0.06, 158),
  900: hex(lightRampL[900], 0.03, 158),
};
const lightWarning = {
  200: hex(lightRampL[200], 0.045, 82),
  300: hex(lightRampL[300], 0.07, 82),
  400: hex(lightRampL[400], 0.085, 82),
  700: hex(lightRampL[700], 0.065, 82),
  900: hex(lightRampL[900], 0.035, 82),
};
const lightDanger = {
  200: hex(lightRampL[200], 0.04, 28),
  300: hex(lightRampL[300], 0.065, 28),
  400: hex(lightRampL[400], 0.09, 28),
  700: hex(lightRampL[700], 0.08, 28),
  900: hex(lightRampL[900], 0.045, 28),
};

const lightSemanticColor = {
  success: lightSuccess[400],
  warning: lightWarning[400],
  danger: lightDanger[400],
  info: lightAccent2Ramp[400],
};

const lightViz = {
  1: hex(0.5, 0.08, 250),
  2: hex(0.5, 0.08, 205),
  3: hex(0.5, 0.08, 160),
  4: hex(0.5, 0.08, 95),
  5: hex(0.5, 0.08, 35),
  6: hex(0.5, 0.08, 305),
  grid: alpha(lightText, 10),
};

const output = `// GENERATED FILE — do not edit by hand.
// Resolved from tokens/colors.css by scripts/build-native-tokens.mjs.
// Re-run \`yarn build\` after changing colors.css to regenerate this file.

export const color = ${JSON.stringify(color, null, 2)} as const;

export const neutral = ${JSON.stringify(neutral, null, 2)} as const;

export const accentRamp = ${JSON.stringify(accentRamp, null, 2)} as const;

export const accent2Ramp = ${JSON.stringify(accent2Ramp, null, 2)} as const;

export const success = ${JSON.stringify(success, null, 2)} as const;

export const warning = ${JSON.stringify(warning, null, 2)} as const;

export const danger = ${JSON.stringify(danger, null, 2)} as const;

export const semanticColor = ${JSON.stringify(semanticColor, null, 2)} as const;

export const viz = ${JSON.stringify(viz, null, 2)} as const;

// ── Light theme mirrors — same shape, resolved against \`[data-theme='light']\` ──

export const lightColor = ${JSON.stringify(lightColor, null, 2)} as const;

export const lightNeutral = ${JSON.stringify(lightNeutral, null, 2)} as const;

export const lightAccentRamp = ${JSON.stringify(lightAccentRamp, null, 2)} as const;

export const lightAccent2Ramp = ${JSON.stringify(lightAccent2Ramp, null, 2)} as const;

export const lightSuccess = ${JSON.stringify(lightSuccess, null, 2)} as const;

export const lightWarning = ${JSON.stringify(lightWarning, null, 2)} as const;

export const lightDanger = ${JSON.stringify(lightDanger, null, 2)} as const;

export const lightSemanticColor = ${JSON.stringify(lightSemanticColor, null, 2)} as const;

export const lightViz = ${JSON.stringify(lightViz, null, 2)} as const;

export const themeColor = { dark: color, light: lightColor } as const;
export type ThemeMode = keyof typeof themeColor;
`;

writeFileSync(join(outDir, 'colors.generated.ts'), output);
