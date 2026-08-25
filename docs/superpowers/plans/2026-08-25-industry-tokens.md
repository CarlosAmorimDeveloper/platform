# @industry/tokens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `@industry/tokens` package — the design-token source of truth for the new "Industry" design system (OKLCH color ramps, typography, spacing/radius/density, elevation and data-viz), ported from `~/Documents/ds/theme.json` and `styles.css`, with a dual web (CSS custom properties) / native (resolved TS constants) output.

**Architecture:** Mirrors `packages/design-system/vuotto-tokens` structure exactly: `src/tokens/*.css` files (one `:root` block each, imported by `src/styles.css`) are the web output, shipped as-is; `src/native/*.ts` files are the mobile output, hand-written except for `src/native/colors.generated.ts` which a build script resolves from the same OKLCH values via `culori` (React Native has no CSS engine and can't resolve `oklch()`/`color-mix()` at runtime). `scripts/build-css.mjs` flattens the `@import` chain into one `dist/styles.css`; `tsup` bundles `src/native/index.ts`. Unlike `@vuotto/tokens`, Industry has **no light theme** — `color-scheme: dark` is fixed, so there is no `[data-theme='light']` override block and no `semanticColors.dark/.light` split on the native side.

**Tech Stack:** TypeScript (strict, `noUncheckedIndexedAccess`), `culori` (OKLCH → hex resolution), `tsup` (native bundle), plain Node scripts (CSS flattening), Yarn workspaces.

**Spec:** `~/Documents/ds/theme.json`, `~/Documents/ds/readme.md`, `~/Documents/ds/DESIGN-SYSTEM.md` (sections 2 Cor, 3 Tipografia, 4 Espaçamento/raio/densidade, 5 Estados de interação, 6 Ícones e imagem), `~/Documents/ds/styles.css` (source `:root` token block, lines 1–110, and the base rules at lines 112–138) — Jira epic REB-48 and subtasks REB-56…REB-61.

## Global Constraints

- **Yarn only** — never `npm`/`pnpm` in this monorepo.
- **Mirror `@vuotto/tokens`'s dual structure** (`packages/design-system/vuotto-tokens/src/{tokens,native}`) — this is explicit in REB-48's description, not just a convention to reuse loosely.
- **No light theme.** `color-scheme: dark` is fixed in `:root`; do not add a `[data-theme='light']` block or a light/dark split anywhere in this package (DESIGN-SYSTEM.md §13 — confirmed no such variant exists for Industry).
- **Never hand-edit `src/native/colors.generated.ts`** — it is produced by `scripts/build-native-tokens.mjs` and regenerated on every `yarn build`.
- **TypeScript strict + `noUncheckedIndexedAccess: true`** (`@repo/typescript-config/base.json`) — do not weaken this locally.
- **ESLint `--max-warnings 0`** (`eslint-plugin-only-warn` converts errors to warnings repo-wide, but the `lint` script fails the build on any warning) — treat every lint warning as build-breaking.
- **No comments that restate the code.** Only comment a non-obvious invariant or a constraint invisible from the code itself (e.g. why a value can't be ported 1:1 to native) — this repo's CLAUDE.md and the user's `feedback-no-comments` memory are stricter than usual: don't add a comment unless removing it would confuse a future reader.
- **This package has no test runner** (`@vuotto/tokens`, the package REB-48 says to mirror, ships zero test files — no `jest.config`, no `test` script). Follow that precedent: verification is "run the build/generation script, then inspect the output for the exact expected values," not a fabricated Jest suite.
- Fonts are **not** self-hosted for this package — `~/Documents/ds/styles.css` loads Barlow/Barlow Condensed via a Google Fonts `@import url(...)`, unlike `@vuotto/tokens`'s self-hosted Manrope/Instrument Serif/JetBrains Mono. Port the CDN `@import` as-is; do not download/vendor font files (no task in REB-56…61 asks for that, unlike vuotto's REB-14).

---

## File Structure

```
packages/design-system/industry-tokens/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── eslint.config.mjs
├── README.md
├── scripts/
│   ├── build-css.mjs            # flattens src/styles.css's @import chain → dist/styles.css, copies src/tokens/* → dist/tokens/*
│   └── build-native-tokens.mjs  # resolves OKLCH → hex/rgba via culori → src/native/colors.generated.ts
└── src/
    ├── styles.css                # @import chain, one line per tokens/*.css file
    ├── tokens/
    │   ├── fonts.css             # Google Fonts CDN @import (Barlow, Barlow Condensed)
    │   ├── colors.css            # base colors, neutral/accent/accent-2/semantic ramps, data-viz
    │   ├── typography.css        # font-family/weight tokens + h1–h6/body scale as custom properties
    │   ├── spacing.css           # space-*, radius-*, control-h(-sm), tap, safe-b/t
    │   ├── effects.css           # shadow-sm/md/lg
    │   └── base.css              # reset, body/heading application, links, focus/selection, .text-muted/.mono
    └── native/
        ├── index.ts                  # barrel re-export
        ├── color-utils.ts            # alpha() helper
        ├── colors.generated.ts       # GENERATED — do not hand-edit
        ├── typography.ts
        ├── typography-adapter.ts     # resolveLineHeight/resolveLetterSpacing
        ├── spacing.ts
        ├── radii.ts
        └── shadows.ts
```

Each task below fills in one vertical slice (one `tokens/*.css` file + its `native/*.ts` counterpart, where one exists) and ends with a real `yarn workspace @industry/tokens build` run.

---

### Task 1: Package scaffold + OKLCH color ramps (REB-56)

**Files:**

- Create: `packages/design-system/industry-tokens/package.json`
- Create: `packages/design-system/industry-tokens/tsconfig.json`
- Create: `packages/design-system/industry-tokens/tsup.config.ts`
- Create: `packages/design-system/industry-tokens/eslint.config.mjs`
- Create: `packages/design-system/industry-tokens/scripts/build-css.mjs`
- Create: `packages/design-system/industry-tokens/scripts/build-native-tokens.mjs`
- Create: `packages/design-system/industry-tokens/src/styles.css`
- Create: `packages/design-system/industry-tokens/src/tokens/fonts.css`
- Create: `packages/design-system/industry-tokens/src/tokens/colors.css`
- Create: `packages/design-system/industry-tokens/src/native/color-utils.ts`
- Create: `packages/design-system/industry-tokens/src/native/index.ts`

**Interfaces:**

- Produces: `alpha(hexColor: string, percent: number): string` (from `color-utils.ts`) — used by every later native task that needs an ad-hoc translucent value.
- Produces (generated by the script, not hand-written — exact shape the script must emit): `color: { bg, surface, surface2, text, accent, accent2, divider, dividerStrong }`, `neutral`, `accentRamp`, `accent2Ramp`: `Record<'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900', string>`, `success`, `warning`, `danger`: `Record<'200'|'300'|'400'|'700'|'900', string>`, `semanticColor: { success, warning, danger, info }`, `viz: { '1'..'6': string, grid: string }` — all in `colors.generated.ts`, re-exported from `index.ts`. Later tasks (typography, spacing, radii, shadows) add their own exports to the same `index.ts`.

- [ ] **Step 1: Create the package manifest**

`packages/design-system/industry-tokens/package.json`:

```json
{
  "name": "@industry/tokens",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/native/index.js",
  "module": "./dist/native/index.mjs",
  "types": "./dist/native/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/native/index.d.ts",
      "import": "./dist/native/index.mjs",
      "require": "./dist/native/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./tokens/*": "./dist/tokens/*"
  },
  "files": ["dist"],
  "scripts": {
    "build": "node scripts/build-native-tokens.mjs && tsup && node scripts/build-css.mjs",
    "dev": "tsup --watch",
    "generate:native-tokens": "node scripts/build-native-tokens.mjs",
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "culori": "^4.0.2",
    "eslint": "^9",
    "tsup": "^8",
    "typescript": "5.9.2"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`, `tsup.config.ts`, `eslint.config.mjs`**

`packages/design-system/industry-tokens/tsconfig.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`packages/design-system/industry-tokens/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'native/index': 'src/native/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
});
```

`packages/design-system/industry-tokens/eslint.config.mjs`:

```js
import { config } from '@repo/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default config;
```

- [ ] **Step 3: Write the CSS flattening script**

`packages/design-system/industry-tokens/scripts/build-css.mjs`:

```js
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

mkdirSync(join(distDir, 'tokens'), { recursive: true });

// Token files ship individually too (package.json `./tokens/*` export).
for (const file of readdirSync(join(srcDir, 'tokens'))) {
  cpSync(join(srcDir, 'tokens', file), join(distDir, 'tokens', file));
}

// Flattened entry point (`./styles.css` export): resolve the `@import`
// chain in src/styles.css into one file.
const entry = readFileSync(join(srcDir, 'styles.css'), 'utf8');
const importPattern = /@import\s+['"]tokens\/([^'"]+)['"];/g;
let flattened = '';
let match;
while ((match = importPattern.exec(entry))) {
  flattened += readFileSync(join(srcDir, 'tokens', match[1]), 'utf8') + '\n';
}

writeFileSync(join(distDir, 'styles.css'), flattened);
```

- [ ] **Step 4: Write the native color-generation script**

`packages/design-system/industry-tokens/scripts/build-native-tokens.mjs`:

```js
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatHex, oklch } from 'culori';

// React Native's StyleSheet has no CSS engine — it can't resolve oklch() or
// color-mix() at runtime, so every color has to be a concrete hex/rgba value
// computed ahead of time. This script mirrors tokens/colors.css value-for-value
// and resolves it with culori, so the two token sources can't silently drift
// without someone noticing (this file regenerates from source on every build,
// it's never hand-edited).

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'native');
mkdirSync(outDir, { recursive: true });

function hex(l, c, h) {
  return formatHex(oklch({ mode: 'oklch', l, c, h }));
}

// color-mix(in srgb, COLOR X%, transparent) — with fully transparent as the
// other side, premultiplied-alpha interpolation reduces to "COLOR at X%
// alpha", regardless of the interpolation color space.
function alpha(hexColor, percent) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}

// ── Base colors (tokens/colors.css :root, first block) ──
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

// ── Tonal ramps: one shared L/C scale, hue per role ──
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

// ── Semantics: same scale, hue rotated off the steel ──
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

// ── Data-viz: six series, one L/C, hue-spread. Assign in order. ──
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
```

- [ ] **Step 5: Write `tokens/fonts.css` and `tokens/colors.css`**

`packages/design-system/industry-tokens/src/tokens/fonts.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700&family=Barlow+Condensed:wght@400;600&display=swap');
```

`packages/design-system/industry-tokens/src/tokens/colors.css` (verbatim from `~/Documents/ds/styles.css` lines 5–80, minus the font tokens which move to `typography.css` in Task 2):

```css
:root {
  color-scheme: dark;

  --color-bg: #14161a;
  --color-surface: #1c1f24;
  --color-surface-2: #24282e;
  --color-text: #e6e9ec;
  --color-accent: oklch(0.72 0.065 250);
  --color-accent-2: oklch(0.72 0.065 235);
  --color-divider: color-mix(in srgb, #e6e9ec 16%, transparent);
  --color-divider-strong: color-mix(in srgb, #e6e9ec 30%, transparent);

  /* Tonal ramps — one shared OKLCH lightness/chroma scale, hue per role, so the same
     step of any role carries the same visual weight. On this dark ground the 300–400
     steps are the readable "base", 100–200 are for type on tinted fills,
     700–900 for fills, hovers and hairlines. */
  --color-neutral-100: oklch(0.95 0.006 250);
  --color-neutral-200: oklch(0.88 0.006 250);
  --color-neutral-300: oklch(0.8 0.006 250);
  --color-neutral-400: oklch(0.72 0.006 250);
  --color-neutral-500: oklch(0.64 0.006 250);
  --color-neutral-600: oklch(0.55 0.006 250);
  --color-neutral-700: oklch(0.45 0.006 250);
  --color-neutral-800: oklch(0.34 0.006 250);
  --color-neutral-900: oklch(0.24 0.006 250);

  --color-accent-100: oklch(0.95 0.02 250);
  --color-accent-200: oklch(0.88 0.035 250);
  --color-accent-300: oklch(0.8 0.05 250);
  --color-accent-400: oklch(0.72 0.065 250);
  --color-accent-500: oklch(0.64 0.075 250);
  --color-accent-600: oklch(0.55 0.07 250);
  --color-accent-700: oklch(0.45 0.06 250);
  --color-accent-800: oklch(0.34 0.045 250);
  --color-accent-900: oklch(0.24 0.03 250);

  /* accent-2 is the same steel voice one hue-step over — kept so both sets resolve. */
  --color-accent-2-100: oklch(0.95 0.02 235);
  --color-accent-2-200: oklch(0.88 0.035 235);
  --color-accent-2-300: oklch(0.8 0.05 235);
  --color-accent-2-400: oklch(0.72 0.065 235);
  --color-accent-2-500: oklch(0.64 0.075 235);
  --color-accent-2-600: oklch(0.55 0.07 235);
  --color-accent-2-700: oklch(0.45 0.06 235);
  --color-accent-2-800: oklch(0.34 0.045 235);
  --color-accent-2-900: oklch(0.24 0.03 235);

  /* Semantics — same scale, hue rotated off the steel. Contained on purpose. */
  --color-success-200: oklch(0.88 0.035 158);
  --color-success-300: oklch(0.8 0.055 158);
  --color-success-400: oklch(0.72 0.07 158);
  --color-success-700: oklch(0.45 0.06 158);
  --color-success-900: oklch(0.24 0.03 158);
  --color-warning-200: oklch(0.88 0.045 82);
  --color-warning-300: oklch(0.8 0.07 82);
  --color-warning-400: oklch(0.76 0.085 82);
  --color-warning-700: oklch(0.45 0.065 82);
  --color-warning-900: oklch(0.24 0.035 82);
  --color-danger-200: oklch(0.88 0.04 28);
  --color-danger-300: oklch(0.8 0.065 28);
  --color-danger-400: oklch(0.72 0.09 28);
  --color-danger-700: oklch(0.45 0.08 28);
  --color-danger-900: oklch(0.24 0.045 28);
  --color-success: var(--color-success-400);
  --color-warning: var(--color-warning-400);
  --color-danger: var(--color-danger-400);
  --color-info: var(--color-accent-2-400);

  /* Data-viz — six series at one lightness and chroma, hue-spread. Use in order. */
  --viz-1: oklch(0.72 0.08 250);
  --viz-2: oklch(0.72 0.08 205);
  --viz-3: oklch(0.72 0.08 160);
  --viz-4: oklch(0.72 0.08 95);
  --viz-5: oklch(0.72 0.08 35);
  --viz-6: oklch(0.72 0.08 305);
  --viz-grid: color-mix(in srgb, var(--color-text) 10%, transparent);
}
```

- [ ] **Step 6: Write `src/styles.css`**

`packages/design-system/industry-tokens/src/styles.css`:

```css
@import 'tokens/fonts.css';
@import 'tokens/colors.css';
```

- [ ] **Step 7: Write the native color-utils and index barrel**

`packages/design-system/industry-tokens/src/native/color-utils.ts`:

```ts
// With fully transparent as the other side, CSS color-mix() (any interpolation
// space) reduces to "COLOR at X% alpha" — this is the runtime version of that,
// for values the generator doesn't precompute.
export function alpha(hexColor: string, percent: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(percent / 100).toFixed(2)})`;
}
```

`packages/design-system/industry-tokens/src/native/index.ts`:

```ts
export {
  color,
  neutral,
  accentRamp,
  accent2Ramp,
  success,
  warning,
  danger,
  semanticColor,
  viz,
} from './colors.generated';
export { alpha } from './color-utils';
```

- [ ] **Step 8: Install dependencies and generate the color tokens**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn install
yarn workspace @industry/tokens generate:native-tokens
```

Expected: `packages/design-system/industry-tokens/src/native/colors.generated.ts` is created. Open it and confirm these exact values appear (precomputed with the same `culori` call the script makes):

```
color.accent      = "#86a8cc"
color.accent2     = "#7cacc8"
color.divider     = "rgba(230, 233, 236, 0.16)"
neutral["500"]    = "#898c90"
accentRamp["400"] = "#86a8cc"
accent2Ramp["400"]= "#7cacc8"
success["400"]    = "#7fb294"
warning["400"]    = "#ccac71"
danger["400"]     = "#d78f85"
viz["1"]          = "#7ea9d5"
viz["6"]          = "#b098cd"
viz.grid          = "rgba(230, 233, 236, 0.10)"
```

If any of these differ, the ramp inputs (`l`/`c`/`h` triples) were transcribed wrong from `colors.css` — fix the script, not the expected values.

- [ ] **Step 9: Run the full build and verify the CSS output**

Run:

```sh
yarn workspace @industry/tokens build
```

Expected: exits 0. Then check `packages/design-system/industry-tokens/dist/styles.css` contains the Google Fonts `@import` line and `--color-accent: oklch(0.72 0.065 250);`. Check `dist/native/index.js` and `dist/native/index.mjs` exist.

Run:

```sh
yarn workspace @industry/tokens check-types
yarn workspace @industry/tokens lint
```

Expected: both exit 0.

- [ ] **Step 10: Commit**

```sh
git add packages/design-system/industry-tokens
git commit -m "feat(industry-tokens): scaffold package and port OKLCH color ramps"
```

---

### Task 2: Typography tokens (REB-57)

**Files:**

- Create: `packages/design-system/industry-tokens/src/tokens/typography.css`
- Create: `packages/design-system/industry-tokens/src/native/typography.ts`
- Create: `packages/design-system/industry-tokens/src/native/typography-adapter.ts`
- Modify: `packages/design-system/industry-tokens/src/styles.css`
- Modify: `packages/design-system/industry-tokens/src/native/index.ts`

**Interfaces:**

- Consumes: nothing from Task 1's exports directly (typography is an independent token category).
- Produces: `fontSize: { h1: 46, h2: 34, h3: 26, h4: 21, h5: 17, h6: 13, body: 16 }`, `fontWeight: { heading: '600', body: '400' }`, `lineHeight: { heading: 1.12, body: 1.55 }`, `letterSpacing: { heading: -0.015, h6: 0.08 }`, `fontFamily: { heading: 'Barlow Condensed', body: 'Barlow' }`, `fontFamilyMono: { ios: 'Menlo', android: 'monospace' }`, `resolveLineHeight(fontSizePx: number, ratio: number): number`, `resolveLetterSpacing(fontSizePx: number, ratio: number): number` — consumed by Task 5's `base.css` (web side, via the CSS custom properties below) and by `@industry/web`/`@industry/mobile` later.

- [ ] **Step 1: Write `tokens/typography.css`**

Source: `~/Documents/ds/styles.css` line 82–85 (font family/weight tokens) plus `~/Documents/ds/DESIGN-SYSTEM.md` §3's h1–h6/body scale, which the source stylesheet hardcodes directly on the element rules (`h1 { font-size: 46px; }`, etc., lines 122–127) rather than exposing as custom properties. Expose them as tokens here — the readme.md rule "never hard-code a hex, a font name or a px value the tokens already carry" applies inside this package too, and the native side (Task 5's `base.css` will consume these vars) needs the same numbers as explicit data regardless.

`packages/design-system/industry-tokens/src/tokens/typography.css`:

```css
:root {
  --font-heading: 'Barlow Condensed', system-ui, sans-serif;
  --font-heading-weight: 600;
  --font-body: 'Barlow', system-ui, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, monospace;

  --text-h1: 46px;
  --text-h2: 34px;
  --text-h3: 26px;
  --text-h4: 21px;
  --text-h5: 17px;
  --text-h6: 13px;
  --text-body: 16px;

  --leading-heading: 1.12;
  --leading-body: 1.55;
  --tracking-heading: -0.015em;
  --tracking-h6: 0.08em;
}
```

- [ ] **Step 2: Add the import to `styles.css`**

`packages/design-system/industry-tokens/src/styles.css`:

```css
@import 'tokens/fonts.css';
@import 'tokens/colors.css';
@import 'tokens/typography.css';
```

- [ ] **Step 3: Write `native/typography.ts`**

`packages/design-system/industry-tokens/src/native/typography.ts`:

```ts
// Resolved from tokens/typography.css. Fixed px per level (Industry has no
// fluid/clamp() scale) — same numbers a browser resolves the CSS to.
export const fontSize = {
  h1: 46,
  h2: 34,
  h3: 26,
  h4: 21,
  h5: 17,
  h6: 13,
  body: 16,
} as const;

export const fontWeight = {
  heading: '600',
  body: '400',
} as const;

export const lineHeight = {
  heading: 1.12,
  body: 1.55,
} as const;

export const letterSpacing = {
  heading: -0.015,
  h6: 0.08,
} as const;

// RN takes one family name per weight/style combo, no CSS fallback stack —
// these only resolve if the app links the matching font file natively.
export const fontFamily = {
  heading: 'Barlow Condensed',
  body: 'Barlow',
} as const;

// `--font-mono` is a system stack (`ui-monospace, 'SF Mono', Menlo, monospace`),
// not a custom font requiring linking — RN has no single name equivalent to a
// CSS fallback list, so this exports the platform-native monospace name for
// the caller to select with `Platform.OS`.
export const fontFamilyMono = {
  ios: 'Menlo',
  android: 'monospace',
} as const;
```

- [ ] **Step 4: Write `native/typography-adapter.ts`**

`packages/design-system/industry-tokens/src/native/typography-adapter.ts`:

```ts
// RN has no unitless line-height or em-based letter-spacing like CSS — both
// are absolute px numbers. The shared token stays the ratio (`lineHeight.heading`,
// `letterSpacing.h6`, ...); these resolve it against whichever fontSize step
// the caller is using.
export function resolveLineHeight(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio);
}

export function resolveLetterSpacing(fontSizePx: number, ratio: number): number {
  return Math.round(fontSizePx * ratio * 100) / 100;
}
```

- [ ] **Step 5: Wire into the index barrel**

`packages/design-system/industry-tokens/src/native/index.ts` — add these two lines after the existing exports:

```ts
export {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  fontFamily,
  fontFamilyMono,
} from './typography';
export { resolveLineHeight, resolveLetterSpacing } from './typography-adapter';
```

- [ ] **Step 6: Build and verify**

Run:

```sh
yarn workspace @industry/tokens build
yarn workspace @industry/tokens check-types
yarn workspace @industry/tokens lint
```

Expected: all exit 0. Check `dist/styles.css` now also contains `--text-h1: 46px;` and `--font-heading: 'Barlow Condensed', system-ui, sans-serif;`.

Sanity-check the adapter with a quick throwaway check (don't commit a script for this — run inline):

```sh
node -e "
const { resolveLineHeight, resolveLetterSpacing } = require('./packages/design-system/industry-tokens/dist/native/index.js');
console.log(resolveLineHeight(46, 1.12));      // expect 52
console.log(resolveLetterSpacing(13, 0.08));   // expect 1.04
"
```

Expected output: `52` then `1.04`.

- [ ] **Step 7: Commit**

```sh
git add packages/design-system/industry-tokens
git commit -m "feat(industry-tokens): port typography tokens and h1-h6 scale"
```

---

### Task 3: Spacing, radius and density tokens (REB-58)

**Files:**

- Create: `packages/design-system/industry-tokens/src/tokens/spacing.css`
- Create: `packages/design-system/industry-tokens/src/native/spacing.ts`
- Create: `packages/design-system/industry-tokens/src/native/radii.ts`
- Modify: `packages/design-system/industry-tokens/src/styles.css`
- Modify: `packages/design-system/industry-tokens/src/native/index.ts`

**Interfaces:**

- Consumes: nothing from prior tasks.
- Produces: `space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 }`, `control: { height: 44, heightSm: 36, tap: 44 }`, `radii: { sm: 2, md: 4, lg: 7 }` — consumed by Task 5's `base.css` (`--space-2`/`--space-3` for margins) and later by `@industry/web`/`@industry/mobile`.

- [ ] **Step 1: Write `tokens/spacing.css`**

Source: `~/Documents/ds/styles.css` lines 87–104 (space/radius/control/tap/safe-area — DESIGN-SYSTEM.md §4 groups these under one "Espaçamento, raio e densidade" heading, so they stay in one file here too).

`packages/design-system/industry-tokens/src/tokens/spacing.css`:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 7px;

  --control-h: 44px;
  --control-h-sm: 36px;
  --tap: 44px;
  --safe-b: env(safe-area-inset-bottom, 0px);
  --safe-t: env(safe-area-inset-top, 0px);
}
```

- [ ] **Step 2: Add the import to `styles.css`**

`packages/design-system/industry-tokens/src/styles.css`:

```css
@import 'tokens/fonts.css';
@import 'tokens/colors.css';
@import 'tokens/typography.css';
@import 'tokens/spacing.css';
```

- [ ] **Step 3: Write `native/spacing.ts` and `native/radii.ts`**

`packages/design-system/industry-tokens/src/native/spacing.ts`:

```ts
// Resolved from tokens/spacing.css. Already unitless px in the source — no
// conversion needed, RN consumes these numbers directly.
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

export const control = {
  height: 44,
  heightSm: 36,
  tap: 44,
} as const;

// `--safe-b` / `--safe-t` (`env(safe-area-inset-*)`) are a web/CSS concept —
// RN apps get the same insets from `react-native-safe-area-context`'s
// `useSafeAreaInsets()` (already the pattern in this repo's mobile apps),
// not from a static token, so they're deliberately not ported here.
```

`packages/design-system/industry-tokens/src/native/radii.ts`:

```ts
// Resolved from tokens/spacing.css. Already unitless px — no conversion.
// The component layer renders every blueprint object at radius 0; these
// exist for the deliberate exception (see readme.md's "Do/Don't").
export const radii = {
  sm: 2,
  md: 4,
  lg: 7,
} as const;
```

- [ ] **Step 4: Wire into the index barrel**

`packages/design-system/industry-tokens/src/native/index.ts` — add:

```ts
export { space, control } from './spacing';
export { radii } from './radii';
```

- [ ] **Step 5: Build and verify**

Run:

```sh
yarn workspace @industry/tokens build
yarn workspace @industry/tokens check-types
yarn workspace @industry/tokens lint
```

Expected: all exit 0. Check `dist/styles.css` contains `--control-h: 44px;` and `--safe-b: env(safe-area-inset-bottom, 0px);`.

```sh
node -e "
const { space, control, radii } = require('./packages/design-system/industry-tokens/dist/native/index.js');
console.log(space[12], control.height, radii.lg); // expect 48 44 7
"
```

Expected output: `48 44 7`.

- [ ] **Step 6: Commit**

```sh
git add packages/design-system/industry-tokens
git commit -m "feat(industry-tokens): port spacing, radius and density tokens"
```

---

### Task 4: Elevation tokens (REB-59)

**Files:**

- Create: `packages/design-system/industry-tokens/src/tokens/effects.css`
- Create: `packages/design-system/industry-tokens/src/native/shadows.ts`
- Modify: `packages/design-system/industry-tokens/src/styles.css`
- Modify: `packages/design-system/industry-tokens/src/native/index.ts`

**Interfaces:**

- Consumes: nothing from prior tasks (data-viz, the other half of REB-59, was already ported in Task 1's `colors.css`/`colors.generated.ts` — DESIGN-SYSTEM.md groups color and data-viz together in §2, elevation is §2.6, kept in its own file here since it has no color-ramp shape).
- Produces: `shadow: Record<'sm'|'md'|'lg', DropShadow>` where `DropShadow = { shadowColor: string; shadowOffset: { width: number; height: number }; shadowRadius: number; shadowOpacity: number; elevation: number }`.

- [ ] **Step 1: Write `tokens/effects.css`**

Source: `~/Documents/ds/styles.css` lines 106–109.

`packages/design-system/industry-tokens/src/tokens/effects.css`:

```css
:root {
  /* Elevation on a dark ground: a hairline edge plus ambient darkness. */
  --shadow-sm:
    0 1px 2px rgb(0 0 0 / 0.4), 0 0 0 1px color-mix(in srgb, var(--color-text) 8%, transparent);
  --shadow-md:
    0 6px 16px rgb(0 0 0 / 0.45), 0 0 0 1px color-mix(in srgb, var(--color-text) 10%, transparent);
  --shadow-lg:
    0 18px 44px rgb(0 0 0 / 0.55), 0 0 0 1px color-mix(in srgb, var(--color-text) 12%, transparent);
}
```

- [ ] **Step 2: Add the import to `styles.css`**

`packages/design-system/industry-tokens/src/styles.css`:

```css
@import 'tokens/fonts.css';
@import 'tokens/colors.css';
@import 'tokens/typography.css';
@import 'tokens/spacing.css';
@import 'tokens/effects.css';
```

- [ ] **Step 3: Write `native/shadows.ts`**

`packages/design-system/industry-tokens/src/native/shadows.ts`:

```ts
export interface DropShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowRadius: number;
  shadowOpacity: number;
  /** Approximate — Android's `elevation` has no color/blur control, this is
   * a rough monochrome stand-in, not a faithful port of the web shadow. */
  elevation: number;
}

// Resolved from tokens/effects.css. RN's shadow* props support one layer —
// the hairline ring each web shadow carries alongside it
// (`0 0 0 1px color-mix(... var(--color-text) N%, transparent)`) has no RN
// equivalent; approximate it separately with `borderWidth: 1` and
// `borderColor: color.divider` (or `color.dividerStrong`) on the same element.
export const shadow: Record<'sm' | 'md' | 'lg', DropShadow> = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowOpacity: 0.45,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 44,
    shadowOpacity: 0.55,
    elevation: 18,
  },
};
```

- [ ] **Step 4: Wire into the index barrel**

`packages/design-system/industry-tokens/src/native/index.ts` — add:

```ts
export { shadow } from './shadows';
export type { DropShadow } from './shadows';
```

- [ ] **Step 5: Build and verify**

Run:

```sh
yarn workspace @industry/tokens build
yarn workspace @industry/tokens check-types
yarn workspace @industry/tokens lint
```

Expected: all exit 0. Check `dist/styles.css` contains `--shadow-md:`.

```sh
node -e "
const { shadow } = require('./packages/design-system/industry-tokens/dist/native/index.js');
console.log(shadow.lg.shadowRadius, shadow.lg.elevation); // expect 44 18
"
```

Expected output: `44 18`.

- [ ] **Step 6: Commit**

```sh
git add packages/design-system/industry-tokens
git commit -m "feat(industry-tokens): port elevation tokens"
```

---

### Task 5: Visual foundations (base.css) and dual-output integration check (REB-60)

**Files:**

- Create: `packages/design-system/industry-tokens/src/tokens/base.css`
- Modify: `packages/design-system/industry-tokens/src/styles.css`

**Interfaces:**

- Consumes: `--color-*` (Task 1), `--font-*`/`--text-*`/`--leading-*`/`--tracking-*` (Task 2), `--space-*` (Task 3) — all as CSS custom properties, resolved by the browser, not by this task.
- Produces: nothing new for other tasks to consume — this is the last web-only file (no native counterpart, same as `fonts.css`: RN has no cascade/selectors to apply a reset or element-level rule to).

- [ ] **Step 1: Write `tokens/base.css`**

Source: `~/Documents/ds/styles.css` lines 112–138, with the hardcoded heading sizes/line-height/letter-spacing replaced by the custom properties Task 2 introduced (`--text-h1`…`--text-h6`/`--text-body`, `--leading-heading`/`--leading-body`, `--tracking-heading`/`--tracking-h6`) so this file has zero literal px/em values duplicating what the token layer already carries.

`packages/design-system/industry-tokens/src/tokens/base.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: var(--leading-body);
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
  font-weight: var(--font-heading-weight);
  line-height: var(--leading-heading);
  letter-spacing: var(--tracking-heading);
  margin: 0 0 var(--space-2);
}
h1 {
  font-size: var(--text-h1);
}
h2 {
  font-size: var(--text-h2);
}
h3 {
  font-size: var(--text-h3);
}
h4 {
  font-size: var(--text-h4);
}
h5 {
  font-size: var(--text-h5);
}
h6 {
  font-size: var(--text-h6);
  letter-spacing: var(--tracking-h6);
  text-transform: uppercase;
}

p {
  margin: 0 0 var(--space-3);
}
a {
  color: var(--color-accent-300);
  text-underline-offset: 3px;
}
a:hover {
  color: var(--color-accent-200);
}
img {
  display: block;
  max-width: 100%;
}
figure {
  margin: 0;
}
figcaption {
  font-size: 12px;
  margin-top: var(--space-1);
  color: color-mix(in srgb, var(--color-text) 55%, transparent);
}

.text-muted {
  color: color-mix(in srgb, var(--color-text) 55%, transparent);
}
.mono {
  font-family: var(--font-mono);
  font-size: 0.92em;
  letter-spacing: 0.02em;
}

:focus {
  outline: none;
}
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
::selection {
  background: color-mix(in srgb, var(--color-accent) 32%, transparent);
}
```

- [ ] **Step 2: Add the import to `styles.css`**

`packages/design-system/industry-tokens/src/styles.css`:

```css
@import 'tokens/fonts.css';
@import 'tokens/colors.css';
@import 'tokens/typography.css';
@import 'tokens/spacing.css';
@import 'tokens/effects.css';
@import 'tokens/base.css';
```

- [ ] **Step 3: Full build and integration check**

Run:

```sh
yarn workspace @industry/tokens build
```

Expected: exits 0, producing `dist/styles.css`, `dist/tokens/*.css` (6 files), `dist/native/index.js`, `dist/native/index.mjs`, `dist/native/index.d.ts`.

Verify the flattened CSS carries every category (all six `grep`s must find a match):

```sh
cd packages/design-system/industry-tokens
grep -q -- "--color-bg: #14161a;" dist/styles.css && echo "colors OK"
grep -q -- "--font-heading: 'Barlow Condensed'" dist/styles.css && echo "typography OK"
grep -q -- "--space-12: 48px;" dist/styles.css && echo "spacing OK"
grep -q -- "--shadow-lg:" dist/styles.css && echo "effects OK"
grep -q "font-family: var(--font-body);" dist/styles.css && echo "base OK"
grep -q "fonts.googleapis.com" dist/styles.css && echo "fonts OK"
cd -
```

Expected: six `OK` lines printed.

Verify the native bundle exports everything from all five tasks:

```sh
node -e "
const t = require('./packages/design-system/industry-tokens/dist/native/index.js');
const expected = ['color','neutral','accentRamp','accent2Ramp','success','warning','danger','semanticColor','viz','alpha','fontSize','fontWeight','lineHeight','letterSpacing','fontFamily','fontFamilyMono','resolveLineHeight','resolveLetterSpacing','space','control','radii','shadow'];
const missing = expected.filter((k) => !(k in t));
console.log(missing.length === 0 ? 'ALL PRESENT' : 'MISSING: ' + missing.join(', '));
"
```

Expected output: `ALL PRESENT`.

Run:

```sh
yarn workspace @industry/tokens check-types
yarn workspace @industry/tokens lint
```

Expected: both exit 0.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-tokens
git commit -m "feat(industry-tokens): port visual foundations and verify dual web/native output"
```

---

### Task 6: Package README — inverted-ink rule and ramp reading (REB-61)

**Files:**

- Create: `packages/design-system/industry-tokens/README.md`

**Interfaces:**

- Consumes: the full export surface from Tasks 1–5 (documents it — must not name an export that doesn't exist in `src/native/index.ts`).
- Produces: nothing consumed by code — this is the terminal task.

- [ ] **Step 1: Write the README**

`packages/design-system/industry-tokens/README.md`:

```markdown
# @industry/tokens

Fonte única dos tokens de design do **Industry** — o design system de blueprint sobre fundo escuro — compartilhada por `@industry/web` e `@industry/mobile`. Portado de `~/Documents/ds/theme.json` e `styles.css`; ver `~/Documents/ds/readme.md` e `~/Documents/ds/DESIGN-SYSTEM.md` para o briefing completo do sistema.

Ao contrário do [`@vuotto/tokens`](../vuotto-tokens/README.md), o Industry **não tem tema claro** — `color-scheme: dark` é fixo no `:root` (`~/Documents/ds/DESIGN-SYSTEM.md`, §13).

## Duas saídas, um valor de origem

- **Web** (`./styles.css`, `./tokens/*`): os arquivos CSS deste pacote, com as mesmas rampas OKLCH do protótipo. Cores em `oklch()`, transparências em `color-mix(in srgb, ...)` — resolvidas pelo motor CSS do browser.
- **Mobile** (import default `.`): React Native não resolve `oklch()`/`color-mix()` em tempo real. `scripts/build-native-tokens.mjs` resolve os mesmos valores de `tokens/colors.css` para hex/rgba concretos via [`culori`](https://culorijs.org), gerando `src/native/colors.generated.ts` (arquivo gerado, nunca editado à mão — refaça `yarn build` depois de mudar `colors.css`).

## Instalação

\`\`\`ts
// Web
import '@industry/tokens/styles.css';

// Mobile
import { color, neutral, accentRamp, success, space, control, fontSize } from '@industry/tokens';
\`\`\`

## Build

\`\`\`sh
yarn workspace @industry/tokens build # gera tudo: tokens nativos, tsup, CSS
yarn workspace @industry/tokens generate:native-tokens # só a etapa de geração (debug rápido)
\`\`\`

## A regra da tinta invertida

Nesta base não existe papel para inverter — **não** troque tinta para `--color-bg`/`color.bg` como se fosse um "branco" de tema claro:

- Um campo cheio é o passo erguido do acento: `--color-accent-800` / `accentRamp['800']`.
- A tinta sobre esse campo é `--color-text` / `color.text`.
- Hairlines e marcas de registro sobre um campo ou uma fotografia são mesclas alfa de `--color-text` — nunca de `--color-bg`.
- `--color-bg` / `color.bg` como primeiro plano só é correto em um lugar: tipo escuro sobre um preenchimento accent-400 (botão primário, segmento marcado, badge sólido).

## Como ler as rampas

A leitura inverte em relação a um tema claro. Para `neutral`, `accentRamp`, `accent2Ramp` e as rampas semânticas (`success`, `warning`, `danger`):

- **300 é o passo legível** — tipo e ícones coloridos sobre o grafite.
- **400 é o preenchimento** — botões, barras de progresso, pontos, trilhos ativos. É o valor por trás dos aliases `color.accent` / `semanticColor.success` / etc.
- **900 é a superfície tingida** — fundo de tag, campo tênue.
- **100–200 é tinta sobre esses preenchimentos tingidos.**

Prefira um passo da rampa a montar uma cor translúcida ad-hoc; `alpha(hex, percent)` existe só para os casos que a rampa não cobre.

Seis séries de dado-viz vivem em `viz['1']`…`viz['6']`, em uma luminosidade e croma fixos, matiz espalhada — atribua em ordem para manter gráficos comparáveis entre telas. Eixos e gridlines usam `viz.grid`.

## O que não traduz 1:1 pra mobile

- **`--font-mono`** é uma pilha de sistema (`ui-monospace, 'SF Mono', Menlo, monospace`), não uma fonte para linkar — exportado como `fontFamilyMono.ios`/`fontFamilyMono.android` em vez de um único `fontFamily.mono`.
- **`--safe-b` / `--safe-t`** (`env(safe-area-inset-*)`) são um conceito de CSS — no mobile, use `useSafeAreaInsets()` de `react-native-safe-area-context` (já é o padrão nos apps deste monorepo), não um token estático.
- **O anel hairline dos shadows** (`0 0 0 1px color-mix(...)` que acompanha cada `--shadow-*`) não existe nas props `shadow*` do RN — aproxime com `borderWidth: 1` e `borderColor: color.divider`/`dividerStrong` no mesmo elemento.
- **Cor do `elevation` no Android**: `elevation` não aceita cor customizada — `shadow.md`/`.lg` etc. têm um `elevation` numérico aproximado (monocromático) ao lado dos campos `shadow*` de verdade (que só valem no iOS).
- **`--radius-sm/md/lg`** existem no token sheet (`radii.sm/md/lg`) mas a camada de componentes do Industry usa cantos retos (`radius: 0`) — só recorra a eles se estiver deliberadamente saindo do vocabulário blueprint (ver `~/Documents/ds/readme.md`).

## Escopo (REB-56 a REB-61)

Cores (rampas OKLCH + data-viz), tipografia (Barlow Condensed/Barlow/mono + escala h1-h6), espaçamento/raio/densidade/touch e elevação. Os componentes de `@industry/web` e `@industry/mobile` (REB-50/51) consomem isso, não o redefinem. O objeto blueprint (`.blueprint`, `.duotone`) é REB-49, não este pacote.
```

- [ ] **Step 2: Verify no export drift**

Run:

```sh
grep -oE "export \{ [^}]+ \}" packages/design-system/industry-tokens/src/native/index.ts
```

Cross-check every name against the README's "Instalação" and "Como ler as rampas" sections by eye — every identifier mentioned in the README (`color`, `neutral`, `accentRamp`, `success`, `space`, `control`, `fontSize`, `semanticColor`, `viz`, `alpha`, `fontFamilyMono`, `radii`, `shadow`, `dividerStrong` as `color.dividerStrong`) must exist in that grep's output or as a nested field of an exported object.

- [ ] **Step 3: Commit**

```sh
git add packages/design-system/industry-tokens/README.md
git commit -m "docs(industry-tokens): document inverted-ink rule and ramp reading"
```

---

## Self-Review Notes

- **Spec coverage:** REB-56 → Task 1 (color ramps + scaffold). REB-57 → Task 2 (typography + h1-h6). REB-58 → Task 3 (spacing/radius/density/touch). REB-59 → Task 4 (elevation) + Task 1 (data-viz, grouped with color per DESIGN-SYSTEM.md §2.4). REB-60 → Task 5 (dual output, verified end-to-end). REB-61 → Task 6 (README: inverted-ink rule + ramp reading). No light theme anywhere (Global Constraints + Task-level notes). Fonts kept as CDN import, not self-hosted (Global Constraints, matches source `styles.css`).
- **Placeholder scan:** no TBD/TODO; every step has literal file content and literal expected command output.
- **Type consistency:** `color`, `neutral`, `accentRamp`, `accent2Ramp`, `success`, `warning`, `danger`, `semanticColor`, `viz` (Task 1) → re-exported unchanged in Tasks 2–5's `index.ts` edits. `DropShadow`/`shadow` (Task 4) match the interface declared in Task 4 and the integration check in Task 5. `fontSize`/`fontFamily`/`fontFamilyMono` (Task 2) match what Task 5's `base.css` conceptually maps to (`--text-h1`…, `--font-heading`, `--font-mono`) and what Task 6's README documents.
