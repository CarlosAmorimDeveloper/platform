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

const text = '#e6e9ec';
const color = {
  bg: '#14161a',
  surface: '#1c1f24',
  surface2: '#24282e',
  text,
  accent: hex(0.72, 0.065, 250),
  accent2: hex(0.72, 0.065, 235),
  divider: alpha(text, 16),
  dividerStrong: alpha(text, 30),
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
  grid: alpha(text, 10),
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
`;

writeFileSync(join(outDir, 'colors.generated.ts'), output);
