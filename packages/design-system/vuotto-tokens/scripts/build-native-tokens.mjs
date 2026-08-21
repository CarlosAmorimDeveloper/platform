import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatHex, oklch } from 'culori';

// React Native's StyleSheet has no CSS engine — it can't resolve oklch() or
// color-mix() at runtime, so every color has to be a concrete hex/rgba value
// computed ahead of time. This script is that computation: it mirrors
// tokens/colors.css value-for-value (dark block + light override block) and
// resolves it with culori, so the two token sources can't silently drift
// without someone noticing (this file regenerates from source on every
// build, it's never hand-edited).

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'native');
mkdirSync(outDir, { recursive: true });

function hex(l, c, h) {
  return formatHex(oklch({ mode: 'oklch', l, c, h }));
}

// color-mix(in oklab, COLOR X%, transparent) — with fully transparent as the
// other side, premultiplied-alpha interpolation reduces to "COLOR at X%
// alpha", regardless of the interpolation color space. See platform/web.ts's
// boxShadow() in @ds/tokens for the same reasoning applied to shadows.
function alpha(hexColor, percent) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}

// ── Base neutrals + accents + semantic status (tokens/colors.css :root) ──
const base = {
  black: hex(0.13, 0.006, 250),
  ink0: hex(0.16, 0.008, 250),
  ink1: hex(0.2, 0.008, 250),
  ink2: hex(0.25, 0.008, 250),
  ink3: hex(0.34, 0.008, 250),
  ink4: hex(0.48, 0.008, 250),
  mute: hex(0.65, 0.006, 250),
  soft: hex(0.8, 0.004, 250),
  white: hex(0.925, 0, 0),
  pure: hex(1, 0, 0),
  cool: hex(0.8, 0.07, 215),
  violet: hex(0.8, 0.07, 300),
  success: hex(0.78, 0.12, 158),
  warning: hex(0.83, 0.12, 82),
  danger: hex(0.68, 0.16, 22),
};

const darkOnlyBgSunken = hex(0.11, 0.006, 250);
const lightBgCanvas = hex(0.975, 0.002, 250);
const lightBgElevated = hex(0.995, 0.001, 250);
const lightBgSunken = hex(0.945, 0.003, 250);

// ── Semantic aliases, dark = default (tokens/colors.css :root) ──
const dark = {
  accent: base.white,
  info: base.cool,
  bgCanvas: base.black,
  bgElevated: base.ink0,
  bgSunken: darkOnlyBgSunken,
  glass1: alpha(base.pure, 5),
  glass2: alpha(base.pure, 8),
  glass3: alpha(base.pure, 12),
  glassScrim: alpha(base.black, 60),
  lineHairline: alpha(base.pure, 9),
  lineStrong: alpha(base.pure, 18),
  lineFocus: alpha(base.white, 55),
  textPrimary: base.soft,
  textHeading: base.white,
  textSecondary: base.mute,
  textTertiary: base.ink4,
  textInverse: base.black,
  textLink: base.cool,
  surfaceCard: alpha(base.pure, 5),
  surfaceRaised: alpha(base.pure, 8),
  surfaceInput: alpha(base.pure, 4),
  surfaceSolid: base.ink1,
};

// ── Light theme scope (tokens/colors.css [data-theme="light"]) ──
const light = {
  accent: dark.accent,
  info: dark.info,
  bgCanvas: lightBgCanvas,
  bgElevated: lightBgElevated,
  bgSunken: lightBgSunken,
  glass1: alpha(base.pure, 66),
  glass2: alpha(base.pure, 82),
  glass3: alpha(base.pure, 92),
  glassScrim: alpha(base.pure, 65),
  lineHairline: alpha(base.black, 10),
  lineStrong: alpha(base.black, 20),
  lineFocus: alpha(base.black, 45),
  textPrimary: base.ink1,
  textHeading: base.black,
  textSecondary: base.ink3,
  textTertiary: base.ink4,
  textInverse: base.white,
  textLink: dark.textLink,
  surfaceCard: alpha(base.pure, 66),
  surfaceRaised: alpha(base.pure, 82),
  surfaceInput: alpha(base.pure, 70),
  surfaceSolid: base.pure,
};

const shadowColor = base.black;

const output = `// GENERATED FILE — do not edit by hand.
// Resolved from tokens/colors.css by scripts/build-native-tokens.mjs.
// Re-run \`yarn build\` after changing colors.css to regenerate this file.

export const vtColors = ${JSON.stringify(base, null, 2)} as const;

export const semanticColors = {
  dark: ${JSON.stringify(dark, null, 2)},
  light: ${JSON.stringify(light, null, 2)},
} as const;

export type ThemeMode = keyof typeof semanticColors;
export type SemanticColors = (typeof semanticColors)[ThemeMode];

// Same source color the web adapter's boxShadow() resolves against
// (tokens/effects.css's --shadow-* all mix from --vt-black).
export const shadowColor = ${JSON.stringify(shadowColor)};
`;

writeFileSync(join(outDir, 'colors.generated.ts'), output);
