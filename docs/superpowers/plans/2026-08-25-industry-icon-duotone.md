# @industry/web + @industry/mobile Icon + Duotone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement `Icon` (REB-64) and `Duotone` (REB-63) — the second and third pieces of the Industry design system's visual signature (REB-49), on both `@industry/web` and `@industry/mobile`.

**Architecture:** `Icon` follows the exact pattern already validated in `@vuotto/web`/`@vuotto/mobile`: web uses `lucide-react/dynamic`'s `DynamicIcon` (one `import()` per glyph, code-split, no third-party script); mobile uses `lucide-react-native`'s `import * as icons` + index-by-name (no dynamic import exists for RN — this is a real, documented bundle-size tradeoff, not a hidden solution, per `vuotto-mobile/README.md`). The one deliberate deviation from the `@vuotto/*` precedent: Industry's own spec (`~/Documents/ds/DESIGN-SYSTEM.md` §6, `~/Documents/ds/readme.md`'s "Don't") mandates a **flat, non-negotiable `stroke-width: 1.5`** — no per-size thickening the way `@vuotto/web`'s `Icon` does at ≤14px. `Duotone` wraps content (typically a photo) with an accent-tinted overlay: on web, a real `mix-blend-mode: color` layer (rendered as a trailing sibling `div`, not a CSS pseudo-element, so no stylesheet is needed — same technique `Frame` already uses for its corner marks); on mobile, React Native has no `mix-blend-mode` at all (confirmed: not part of `ViewStyle` in RN 0.81, and this repo has no `react-native-skia` dependency to add one) — so mobile ships a **documented flat-tint approximation** (a translucent accent-colored overlay `View`, not a true color-blend), per REB-63's own explicit allowance for "um fallback documentado."

Introducing `lucide-react-native` (and its `react-native-svg` dependency) into `@industry/mobile` also means its Storybook's `viteFinal` needs the same two Vite+esbuild stub-plugin pairs `@vuotto/mobile`'s Storybook already carries (`codegenNativeComponent` stub, Fabric `NativeSvg*Module` stub) — without them, `react-native-svg`'s Fabric-only import paths crash Vite's dependency pre-bundling entirely. Even with the stubs, the icons will render _invisible_ (not crash, just blank) in this package's Storybook browser preview — a known, upstream `react-native-web@0.19` React-19 limitation already documented in `@vuotto/mobile/README.md` and in this session's own `industry-mobile/README.md` (written in the prior plan, in anticipation of exactly this). Not a defect to fix here.

**Tech Stack:** `lucide-react` (web), `lucide-react-native` + `react-native-svg` (mobile), React 19, TypeScript strict, Storybook 8.

**Spec:** `~/Documents/ds/DESIGN-SYSTEM.md` §6 "Ícones e imagem" (stroke-width 1.5, duotone via `mix-blend-mode: color`), `~/Documents/ds/readme.md` (Icons section, Components §8.1 `Frame`... §8.2, "Don't" — never thick strokes), `~/Documents/ds/foundations/icons.html`, `~/Documents/ds/foundations/image.html`, `~/Documents/ds/styles.css` lines 155–156 (`.duotone`/`.duotone::after`, the source-of-truth CSS) — Jira REB-64 and REB-63 (subtasks of epic REB-49). Sibling packages used as the literal template for the `Icon` component and the mobile Storybook SVG stub plugins: `packages/design-system/vuotto-web/src/components/core/Icon.tsx`, `packages/design-system/vuotto-mobile/src/components/core/Icon.tsx`, `packages/design-system/vuotto-mobile/.storybook/main.ts`.

## Global Constraints

- **Yarn only** — never `npm`/`pnpm`.
- **`stroke-width` is always `1.5`, no exceptions.** Unlike `@vuotto/web`'s `Icon` (which thickens to `2` at `size <= 14`), Industry's `Icon` defaults `strokeWidth` to `1.5` unconditionally on both platforms — DESIGN-SYSTEM.md §6 and readme.md's "Don't" section are explicit that a thick stroke "quebra o sistema." The prop still exists as an override escape hatch (matching the established component-API shape), but nothing in this plan's own code should ever pass a different value.
- **Web icon names are kebab-case** (`"arrow-right"`), **mobile icon names are PascalCase** (`"ArrowRight"`) — this is `lucide-react`/`lucide-react-native`'s own naming convention per platform, not a Industry-specific choice, and both `Icon` components' `name` prop types must reflect it (`string` on web since `lucide-react/dynamic`'s `IconName` union is what a cast targets; `keyof typeof icons` on mobile since `lucide-react-native/icons`' namespace import gives a concrete union).
- **Mobile's `Duotone` is an explicit approximation, not a bug to "fix" by adding `react-native-skia`.** Do not add a Skia dependency in this plan — REB-63 explicitly permits "um fallback documentado," and adding a large native dependency for one wrapper component is out of scope. Document the approximation in the mobile README (already has an "O que não traduz 1:1" section from the prior plan — extend it, don't duplicate it).
- **TypeScript strict + `noUncheckedIndexedAccess: true`** — do not weaken this locally. Note `icons[name]` (mobile `Icon`) and `SIZES[size]` (both platforms, when `size` is the literal-key variant) index into objects whose key type is a finite union matching the index type exactly — this does not trigger `noUncheckedIndexedAccess` (verified during the prior plan's final review: `Record<K, V>` over a finite literal union is a mapped type with concrete properties, not an index signature).
- **ESLint `--max-warnings 0`** — every lint warning is build-breaking.
- **No comments that restate the code.** Only comment a non-obvious invariant or a constraint invisible from the code itself. This user's standing preference is stricter than usual — when in doubt, don't write the comment. (The Storybook stub-plugin file ported from `vuotto-mobile/.storybook/main.ts` keeps its existing comments unchanged — it's a copied file with genuinely load-bearing explanations of a subtle Vite/esbuild/Fabric interaction, not new authorship.)
- **`Frame` (already built) and `Duotone` compose by nesting, not by merging into one component.** The source system's `.duotone.frame.blueprint` combined class usage (see `~/Documents/ds/foundations/image.html`) is achieved in React by `<Frame><Duotone><img /></Duotone></Frame>`, not a new `FramedDuotone` component. Do not build a merged variant — it isn't needed and isn't asked for.
- **This is the third slice of REB-49.** The Storybook foundation docs (REB-65 — Color, Typography, Semantics & data-viz, Spacing & elevation, Icons, Image) are deliberately out of scope for this plan; two of those six pages (Icons, Image) specifically need `Icon`/`Duotone` to exist first, which is exactly what this plan delivers — REB-65 is the natural next plan after this one.

---

## File Structure

```
packages/design-system/industry-web/
├── package.json                          (modify — add lucide-react)
└── src/components/core/
    ├── Icon.tsx
    ├── Icon.stories.tsx
    ├── Duotone.tsx
    ├── Duotone.stories.tsx
    └── index.ts                          (modify)

packages/design-system/industry-mobile/
├── package.json                          (modify — add lucide-react-native, react-native-svg)
├── .storybook/
│   └── main.ts                           (modify — add SVG/Fabric stub plugins)
└── src/components/core/
    ├── Icon.tsx
    ├── Icon.stories.tsx
    ├── Duotone.tsx
    ├── Duotone.stories.tsx
    └── index.ts                          (modify)

packages/design-system/industry-web/README.md      (modify)
packages/design-system/industry-mobile/README.md   (modify)
```

---

### Task 1: `Icon` on `@industry/web` (REB-64 web half)

**Files:**

- Modify: `packages/design-system/industry-web/package.json`
- Create: `packages/design-system/industry-web/src/components/core/Icon.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Icon.stories.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/index.ts`

**Interfaces:**

- Produces: `Icon` React component — `interface IconProps { name: string; size?: 'xs'|'sm'|'md'|'lg'|number; color?: string; strokeWidth?: number; className?: string; style?: React.CSSProperties; 'aria-label'?: string }`. Re-exported from `core/index.ts` (already re-exported transitively from `src/index.ts` via `export * from './components/core'`, unchanged from the prior plan).

- [ ] **Step 1: Add the `lucide-react` dependency**

Edit `packages/design-system/industry-web/package.json` — add this line to `"dependencies"` (currently just `"@industry/tokens": "*"`):

```json
"dependencies": {
  "@industry/tokens": "*",
  "lucide-react": "^1.33.0"
},
```

- [ ] **Step 2: Write the `Icon` component**

`packages/design-system/industry-web/src/components/core/Icon.tsx`:

```tsx
import type { CSSProperties } from 'react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 'sm',
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  style,
  'aria-label': ariaLabel,
}: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];

  return (
    <DynamicIcon
      name={name as IconName}
      size={px}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    />
  );
}
```

- [ ] **Step 3: Write the Storybook stories**

`packages/design-system/industry-web/src/components/core/Icon.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'arrow-right',
    size: 'sm',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'var(--color-text)' }}>
      <Icon name="settings" size="xs" />
      <Icon name="settings" size="sm" />
      <Icon name="settings" size="md" />
      <Icon name="settings" size="lg" />
    </div>
  ),
};

export const AsAction: Story = {
  args: {
    name: 'x',
    'aria-label': 'Fechar',
  },
};
```

- [ ] **Step 4: Update the barrel export**

`packages/design-system/industry-web/src/components/core/index.ts` — add these two lines after the existing `Frame` exports:

```ts
export { Icon } from './Icon';
export type { IconProps, IconSize } from './Icon';
```

- [ ] **Step 5: Install and build**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn install
yarn workspace @industry/web build
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
```

Expected: all exit 0.

- [ ] **Step 6: Verify Storybook builds and renders the icon chunk-split**

Run:

```sh
yarn workspace @industry/web build-storybook
```

Expected: exits 0. Check that Lucide icons are code-split into their own small chunks (not one giant bundle) — this is the behavior REB-64 asks for ("cada ícone como chunk próprio"):

```sh
ls packages/design-system/industry-web/storybook-static/assets/ | grep -iE "arrow-right|settings|^x-" | head -5
```

Expected: at least one file matching each icon name used in the stories (`arrow-right`, `settings`, and `x` or similar), confirming per-icon chunking — the same behavior already established (and documented, not CI-enforced) in `@vuotto/web`.

- [ ] **Step 7: Commit**

```sh
git add packages/design-system/industry-web
git commit -m "feat(industry-web): implement Icon component"
```

---

### Task 2: `Icon` on `@industry/mobile` (REB-64 mobile half)

**Files:**

- Modify: `packages/design-system/industry-mobile/package.json`
- Modify: `packages/design-system/industry-mobile/.storybook/main.ts`
- Create: `packages/design-system/industry-mobile/src/components/core/Icon.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Icon.stories.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/index.ts`

**Interfaces:**

- Produces: `Icon` RN component — `interface IconProps { name: IconName; size?: 'xs'|'sm'|'md'|'lg'|number; color: string; strokeWidth?: number; style?: StyleProp<ViewStyle>; accessibilityLabel?: string }` where `IconName = keyof typeof import('lucide-react-native/icons')`. Re-exported from `core/index.ts`.

- [ ] **Step 1: Add the `lucide-react-native` and `react-native-svg` dependencies**

Edit `packages/design-system/industry-mobile/package.json`:

```json
"dependencies": {
  "@industry/tokens": "*",
  "lucide-react-native": "^1.33.0"
},
"peerDependencies": {
  "react": ">=18",
  "react-native": ">=0.72",
  "react-native-svg": ">=13"
},
```

And add `"react-native-svg": "^15.0.0"` to `"devDependencies"` (alphabetical position, after `"react-native"`).

- [ ] **Step 2: Extend the Storybook config with the SVG/Fabric stub plugins**

`packages/design-system/industry-mobile/.storybook/main.ts` — replace the entire file with (ported from `packages/design-system/vuotto-mobile/.storybook/main.ts`, comments kept verbatim since they document a genuinely non-obvious Vite/esbuild/Fabric interaction):

```ts
import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';
import type { PluginBuild } from 'esbuild';

const CODEGEN_STUB_SOURCE = `export default function codegenNativeComponent(name) {
  function NativeComponent(props) { return props.children ?? null; }
  NativeComponent.displayName = name;
  return NativeComponent;
}`;

// react-native-svg's Fabric components import 'codegenNativeComponent' from
// react-native — Vite's alias rewrites that to react-native-web, which
// doesn't ship the path at all (unlike @ds/mobile's case, where it's
// react-native-safe-area-context hitting the same gap). Same stub, same
// reason: this is a Fabric-only codegen helper with no runtime behavior
// react-native-web needs, so a component that forwards children is enough.
//
// This needs BOTH a Vite plugin (for Rollup's production build) and an
// esbuild plugin (for the dev server's dependency pre-bundling) — esbuild
// doesn't run Vite's resolveId/load hooks. Intercepting the import this way,
// rather than excluding react-native-svg from optimizeDeps entirely, matters:
// excluding the whole package also skips esbuild's CJS→ESM conversion for
// every other file inside it, including transform.js (a PEG.js-generated
// `module.exports = { parse }` file) — importers doing `import { parse }`
// against that raw CommonJS then fail in the browser with "does not provide
// an export named 'parse'".
const codegenStubPlugin: Plugin = {
  name: 'react-native-codegen-stub',
  resolveId(id) {
    if (id.endsWith('/codegenNativeComponent')) {
      return '\0react-native-codegen-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-codegen-stub') {
      return CODEGEN_STUB_SOURCE;
    }
  },
};

const codegenStubEsbuildPlugin = {
  name: 'react-native-codegen-stub-esbuild',
  setup(build: PluginBuild) {
    build.onResolve({ filter: /\/codegenNativeComponent$/ }, () => ({
      path: 'react-native-codegen-stub',
      namespace: 'react-native-codegen-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'react-native-codegen-stub' }, () => ({
      contents: CODEGEN_STUB_SOURCE,
      loader: 'js' as const,
    }));
  },
};

// react-native-svg/lib/module/fabric/NativeSvg{Renderable,View}Module.js call
// `TurboModuleRegistry.getEnforcing(...)` — react-native-web has no
// TurboModuleRegistry export at all. Both files are only reached via
// `require()` inside rarely-used geometry-introspection methods (getBBox,
// getCTM, toDataURL, ...) that lucide-react-native's icon rendering never
// calls, so a no-op stub is safe: it only needs to satisfy the static
// resolution these `require()` calls still trigger during bundling, not
// behave like the real native module.
const FABRIC_SVG_MODULE_STUB_SOURCE = `const noop = () => null;
export default {
  toDataURL: noop, getBBox: noop, getCTM: noop, getScreenCTM: noop,
  isPointInFill: noop, isPointInStroke: noop, getTotalLength: noop, getPointAtLength: noop,
};`;
const FABRIC_SVG_MODULE_FILTER = /\/fabric\/NativeSvg(Renderable|View)Module(\.js)?$/;

const fabricSvgModuleStubPlugin: Plugin = {
  name: 'react-native-svg-fabric-module-stub',
  resolveId(id) {
    if (FABRIC_SVG_MODULE_FILTER.test(id)) {
      return '\0react-native-svg-fabric-module-stub';
    }
  },
  load(id) {
    if (id === '\0react-native-svg-fabric-module-stub') {
      return FABRIC_SVG_MODULE_STUB_SOURCE;
    }
  },
};

const fabricSvgModuleStubEsbuildPlugin = {
  name: 'react-native-svg-fabric-module-stub-esbuild',
  setup(build: PluginBuild) {
    build.onResolve({ filter: FABRIC_SVG_MODULE_FILTER }, () => ({
      path: 'react-native-svg-fabric-module-stub',
      namespace: 'react-native-svg-fabric-module-stub',
    }));
    build.onLoad({ filter: /.*/, namespace: 'react-native-svg-fabric-module-stub' }, () => ({
      contents: FABRIC_SVG_MODULE_STUB_SOURCE,
      loader: 'js' as const,
    }));
  },
};

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },

  async viteFinal(baseConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(baseConfig, {
      plugins: [codegenStubPlugin, fabricSvgModuleStubPlugin],
      resolve: {
        alias: {
          'react-native': 'react-native-web',
        },
        extensions: [
          '.web.js',
          '.web.ts',
          '.web.tsx',
          '.web.jsx',
          '.mjs',
          '.js',
          '.mts',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ],
      },
      optimizeDeps: {
        include: ['react-native-web'],
        exclude: ['react-native-safe-area-context'],
        esbuildOptions: {
          plugins: [codegenStubEsbuildPlugin, fabricSvgModuleStubEsbuildPlugin],
        },
      },
    });
  },
};

export default config;
```

- [ ] **Step 3: Write the `Icon` component**

`packages/design-system/industry-mobile/src/components/core/Icon.tsx`:

```tsx
import type { StyleProp, ViewStyle } from 'react-native';
import * as icons from 'lucide-react-native/icons';

const SIZES = { xs: 14, sm: 16, md: 20, lg: 24 } as const;

export type IconSize = keyof typeof SIZES | number;
export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 'sm',
  color,
  strokeWidth = 1.5,
  style,
  accessibilityLabel,
}: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const LucideIcon = icons[name];

  return (
    <LucideIcon
      size={px}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
    />
  );
}
```

- [ ] **Step 4: Write the Storybook stories**

`packages/design-system/industry-mobile/src/components/core/Icon.stories.tsx`:

```tsx
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { color } from '@industry/tokens';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Core/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'ArrowRight',
    size: 'sm',
    color: color.text,
  },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Icon name="Settings" size="xs" color={color.text} />
      <Icon name="Settings" size="sm" color={color.text} />
      <Icon name="Settings" size="md" color={color.text} />
      <Icon name="Settings" size="lg" color={color.text} />
    </View>
  ),
};

export const AsAction: Story = {
  args: {
    name: 'X',
    color: color.text,
    accessibilityLabel: 'Fechar',
  },
};
```

- [ ] **Step 5: Update the barrel export**

`packages/design-system/industry-mobile/src/components/core/index.ts` — add these two lines after the existing `Frame` exports:

```ts
export { Icon } from './Icon';
export type { IconProps, IconSize, IconName } from './Icon';
```

- [ ] **Step 6: Install and build**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn install
yarn workspace @industry/mobile build
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile test
```

Expected: all exit 0, existing `Frame` tests still 3/3.

- [ ] **Step 7: Verify Storybook builds (icons will be present but visually blank — expected)**

Run:

```sh
yarn workspace @industry/mobile build-storybook
```

Expected: exits 0. Do NOT try to "fix" invisible icons in this browser preview — this is the pre-documented `react-native-web`/React 19 SVG gap (see this plan's Architecture section and both packages' READMEs). The check here is only that the build itself succeeds (proving the stub plugins correctly prevent a hard crash), not that icons render.

- [ ] **Step 8: Commit**

```sh
git add packages/design-system/industry-mobile
git commit -m "feat(industry-mobile): implement Icon component"
```

---

### Task 3: `Duotone` on `@industry/web` (REB-63 web half)

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/Duotone.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Duotone.stories.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/index.ts`

**Interfaces:**

- Consumes: nothing from Task 1/2 (independent component).
- Produces: `Duotone` React component — `interface DuotoneProps { children?: React.ReactNode; style?: React.CSSProperties; className?: string }`. Re-exported from `core/index.ts`.

- [ ] **Step 1: Write the `Duotone` component**

Source: `~/Documents/ds/styles.css` lines 155–156 (`.duotone { position: relative; overflow: hidden; } .duotone::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: var(--color-accent); mix-blend-mode: color; }`). The `::after` overlay is rendered as a real trailing sibling `div` here (same technique `Frame.tsx` already uses for its corner marks) rather than a CSS pseudo-element, so no stylesheet is needed.

`packages/design-system/industry-web/src/components/core/Duotone.tsx`:

```tsx
import type { CSSProperties, ReactNode } from 'react';

export interface DuotoneProps {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function Duotone({ children, style, className }: DuotoneProps) {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {children}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'var(--color-accent)',
          mixBlendMode: 'color',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write the Storybook stories**

`packages/design-system/industry-web/src/components/core/Duotone.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Duotone } from './Duotone';

const meta: Meta<typeof Duotone> = {
  title: 'Core/Duotone',
  component: Duotone,
};

export default meta;
type Story = StoryObj<typeof Duotone>;

export const OverColor: Story = {
  render: () => <Duotone style={{ width: 320, height: 220, background: 'var(--color-surface)' }} />,
};

export const WithImage: Story = {
  render: () => (
    <Duotone style={{ width: 320 }}>
      <img src="https://picsum.photos/320/220" alt="" style={{ display: 'block', width: '100%' }} />
    </Duotone>
  ),
};
```

- [ ] **Step 3: Update the barrel export**

`packages/design-system/industry-web/src/components/core/index.ts` — add these two lines:

```ts
export { Duotone } from './Duotone';
export type { DuotoneProps } from './Duotone';
```

- [ ] **Step 4: Build and verify**

Run:

```sh
yarn workspace @industry/web build
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check the built preview registers the story:

```sh
grep -rl "Core/Duotone" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match.

- [ ] **Step 5: Commit**

```sh
git add packages/design-system/industry-web
git commit -m "feat(industry-web): implement Duotone component"
```

---

### Task 4: `Duotone` on `@industry/mobile` (REB-63 mobile half)

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/Duotone.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Duotone.test.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Duotone.stories.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/index.ts`

**Interfaces:**

- Consumes: `color` and `alpha` from `@industry/tokens`.
- Produces: `Duotone` RN component — `interface DuotoneProps { children?: React.ReactNode; style?: StyleProp<ViewStyle> }`. Re-exported from `core/index.ts`.

- [ ] **Step 1: Write the failing test**

React Native has no `mix-blend-mode` — this test verifies the documented flat-tint approximation renders an overlay with `testID="duotone-overlay"` and the expected accent-tinted `backgroundColor`, not that it visually blends.

`packages/design-system/industry-mobile/src/components/core/Duotone.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { color, alpha } from '@industry/tokens';
import { Duotone } from './Duotone';

describe('Duotone', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Duotone>
        <Text>photo</Text>
      </Duotone>,
    );
    expect(getByText('photo')).toBeTruthy();
  });

  it('renders an accent-tinted overlay', () => {
    const { getByTestId } = render(<Duotone />);
    const overlay = getByTestId('duotone-overlay');
    expect(overlay.props.style).toMatchObject({ backgroundColor: alpha(color.accent, 55) });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn workspace @industry/mobile test
```

Expected: FAILS — `Cannot find module './Duotone'` (or equivalent), since `Duotone.tsx` doesn't exist yet.

- [ ] **Step 3: Write the `Duotone` component**

`packages/design-system/industry-mobile/src/components/core/Duotone.tsx`:

```tsx
import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

const OVERLAY_COLOR = alpha(color.accent, 55);

export interface DuotoneProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Duotone({ children, style }: DuotoneProps) {
  return (
    <View style={[{ position: 'relative', overflow: 'hidden' }, style]}>
      {children}
      <View
        testID="duotone-overlay"
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: OVERLAY_COLOR,
        }}
      />
    </View>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```sh
yarn workspace @industry/mobile test
```

Expected: PASS, 2/2 tests (plus `Frame`'s and `Icon` has no tests — total suite should show `Frame.test.tsx` 3 passing + `Duotone.test.tsx` 2 passing = 5/5).

- [ ] **Step 5: Write the Storybook stories**

`packages/design-system/industry-mobile/src/components/core/Duotone.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { color } from '@industry/tokens';
import { Duotone } from './Duotone';

const meta: Meta<typeof Duotone> = {
  title: 'Core/Duotone',
  component: Duotone,
};

export default meta;
type Story = StoryObj<typeof Duotone>;

export const OverColor: Story = {
  render: () => <Duotone style={{ width: 320, height: 220, backgroundColor: color.surface }} />,
};
```

- [ ] **Step 6: Update the barrel export**

`packages/design-system/industry-mobile/src/components/core/index.ts` — add these two lines:

```ts
export { Duotone } from './Duotone';
export type { DuotoneProps } from './Duotone';
```

- [ ] **Step 7: Build and verify everything together**

Run:

```sh
yarn workspace @industry/mobile build
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile test
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0, test suite 5/5.

- [ ] **Step 8: Commit**

```sh
git add packages/design-system/industry-mobile
git commit -m "feat(industry-mobile): implement Duotone component"
```

---

### Task 5: Update package READMEs (REB-64 + REB-63 documentation)

**Files:**

- Modify: `packages/design-system/industry-web/README.md`
- Modify: `packages/design-system/industry-mobile/README.md`

**Interfaces:**

- Consumes: the final export surface of both packages from Tasks 1–4 (documents it — must not name an export that doesn't exist).
- Produces: nothing consumed by code — terminal task.

- [ ] **Step 1: Update the web README**

`packages/design-system/industry-web/README.md` — in the "Componentes" section, after the existing `Frame` paragraph, add:

```markdown
**`Icon`** — wrapper fino sobre `lucide-react/dynamic` (`DynamicIcon`): um `import()` por glifo, cada ícone vira seu próprio chunk (sem bundle único de todos os ícones). `props`: `name` (kebab-case, ex. `"arrow-right"`), `size` (`xs`|`sm`|`md`|`lg`|número — 14/16/20/24px, padrão `sm`), `color` (padrão `currentColor`), `strokeWidth` (padrão **1.5, sempre** — o sistema não tem variação por tamanho como no `@vuotto/web`), `className`, `style`, `aria-label` (decorativo por padrão, `aria-hidden` a menos que um label seja passado).

**`Duotone`** — wrapper de imagem: aplica o acento via `mix-blend-mode: color` (efeito de serigrafia), a mesma leitura que `~/Documents/ds/foundations/image.html` documenta. `props`: `children`, `style`, `className`. Compõe com `Frame` por aninhamento (`<Frame><Duotone><img /></Duotone></Frame>`), não é uma variante fundida.
```

Also update the "Escopo" section's final sentence to reflect what's now built — replace the old closing sentence (which said `Icon`/`.duotone`/controls/etc. "chegam em PRs seguintes") with:

```markdown
`Icon` e `Duotone` (REB-64, REB-63) estão prontos. As páginas de fundação no Storybook (REB-65) e os controles/layout/navegação/feedback/dados (REB-67 a REB-71) chegam em PRs seguintes.
```

- [ ] **Step 2: Update the mobile README**

`packages/design-system/industry-mobile/README.md` — in the "Componentes" section, after the existing `Frame` paragraph, add:

```markdown
**`Icon`** — wrapper fino sobre `lucide-react-native` (`import * as icons from 'lucide-react-native/icons'`, indexado por nome). `props`: `name` (PascalCase, ex. `"ArrowRight"` — convenção do próprio `lucide-react-native`, diferente do kebab-case do web), `size` (`xs`|`sm`|`md`|`lg`|número, padrão `sm`), `color` (**obrigatório** — RN não tem `currentColor`), `strokeWidth` (padrão **1.5, sempre**), `style`, `accessibilityLabel`. Sem import dinâmico por nome — `lucide-react-native` não tem equivalente ao `lucide-react/dynamic` do web, então este wrapper importa todos os ícones (troca real de tamanho de bundle, documentada, não escondida — mesma decisão do `@vuotto/mobile`).

**`Duotone`** — wrapper de imagem. **Aproximação documentada**, não um `mix-blend-mode` real: React Native não tem essa propriedade (não faz parte de `ViewStyle` no RN 0.81, e este monorepo não depende de `react-native-skia`, que teria blend modes de verdade). O que existe aqui é uma sobreposição plana com opacidade do acento (`alpha(color.accent, 55)`) — visualmente diferente de um blend real (tinge uniformemente em vez de preservar a luminância da foto por baixo), mas é o fallback que o REB-63 explicitamente permite. `props`: `children`, `style`.
```

Also add to the existing "O que não traduz 1:1 pra mobile" section (do not duplicate — this extends the section already written in the prior plan):

```markdown
- **`mix-blend-mode: color`** (o efeito duotone de verdade) não existe no RN — `Duotone` usa uma sobreposição translúcida do acento como aproximação, não um blend real. Ver "Componentes" acima.
```

And update the "Escopo" section's final sentence the same way as the web README:

```markdown
`Icon` e `Duotone` (REB-64, REB-63) estão prontos. As páginas de fundação no Storybook (REB-65) e os controles/layout/navegação/feedback/dados (REB-73 a REB-77) chegam em PRs seguintes.
```

- [ ] **Step 3: Verify no export drift**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
cat packages/design-system/industry-web/src/components/core/index.ts
cat packages/design-system/industry-mobile/src/components/core/index.ts
```

Confirm both files now export exactly `Frame`, `Icon`, `Duotone` (plus their types) — matches both READMEs' updated "Componentes" sections.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/README.md packages/design-system/industry-mobile/README.md
git commit -m "docs(industry): document Icon and Duotone components"
```

---

## Self-Review Notes

- **Spec coverage:** REB-64 → Tasks 1 (web) + 2 (mobile), including the mandatory flat `strokeWidth: 1.5` (a deliberate deviation from the `@vuotto/*` precedent, called out in Global Constraints) and the required Storybook SVG stub plugins for mobile. REB-63 → Tasks 3 (web, real `mix-blend-mode`) + 4 (mobile, documented flat-tint approximation, with a real Jest test verifying the overlay color rather than just asserting it renders). Task 5 documents both for both platforms. REB-65 (foundation docs) explicitly out of scope, follow-up plan.
- **Placeholder scan:** no TBD/TODO; every step has literal file content and literal expected command/verification output. Task 2 Step 7 explicitly instructs NOT to try to fix the known-invisible mobile Storybook icon rendering, rather than silently glossing over it.
- **Type consistency:** `Icon`/`IconProps`/`IconSize` (Task 1, web) and `Icon`/`IconProps`/`IconSize`/`IconName` (Task 2, mobile) are two distinct, platform-appropriate interfaces, both re-exported the same way `Frame`'s were in the prior plan. `Duotone`/`DuotoneProps` (Tasks 3–4) likewise. `color`/`alpha` imports in Tasks 2 and 4 match `@industry/tokens`'s actual `src/native/index.ts` export names (already verified in the prior plan's final review).
