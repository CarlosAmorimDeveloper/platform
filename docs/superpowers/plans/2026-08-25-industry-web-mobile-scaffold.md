# @industry/web + @industry/mobile Scaffold + Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `@industry/web` and `@industry/mobile` workspaces (build tooling, Storybook, CI/Chromatic) and implement their first real component, `Frame` — the blueprint corner-mark primitive that is the Industry design system's visual signature.

**Architecture:** Mirrors `packages/design-system/vuotto-web` and `packages/design-system/vuotto-mobile` exactly: flat `"."` package export backed by a `dist/` built with `tsup` (not `@ds/web`'s subpath-to-source pattern), `src/components/{core,data,feedback,forms,navigation}` taxonomy (only `core/` populated in this plan), flat `Name.tsx` + `Name.stories.tsx` pairs per component, Storybook via `@storybook/react-vite`. `@industry/mobile` additionally gets a Jest ("node env") setup ported from `@ds/mobile` (the only sibling package with one — `@vuotto/mobile` has none), since `react-native-web`'s lack of React 19 SVG support means a component that has no `react-native-svg` dependency (like `Frame`) is exactly the kind of component a real Jest test can verify today, unlike `Icon`-family components (future work) whose Storybook preview is known-broken. `Frame` itself is implemented with plain inline styles / RN `style` props on both platforms — no CSS file, no `react-native-svg` — because the corner "+" marks are rendered as literal child elements (two thin bars per corner), not CSS pseudo-elements, so nothing forces a stylesheet or an SVG dependency into this first slice.

**Tech Stack:** React 19, TypeScript (strict, `noUncheckedIndexedAccess`), `tsup` (bundling), Storybook 8 (`@storybook/react-vite`), Jest + `@testing-library/react-native` (mobile only), `react-native-web` (mobile Storybook browser preview only), Yarn workspaces, Chromatic.

**Spec:** `~/Documents/ds/DESIGN-SYSTEM.md` §7 "Objetos blueprint", `~/Documents/ds/readme.md` (Direction, Components §8.2 `Frame`, Don't), `~/Documents/ds/styles.css` lines 140–153 (`.blueprint`/`.corner` CSS, the source-of-truth pixel values) — Jira epic REB-49 (blueprint signature) and its prerequisite subtasks REB-66 (`@industry/web` workspace) and REB-72 (`@industry/mobile` workspace) from epics REB-50/REB-51, plus REB-62 (the `Frame` component itself). Sibling packages used as the literal template for every config file in this plan: `packages/design-system/vuotto-web/*`, `packages/design-system/vuotto-mobile/*`, and `packages/design-system/mobile/jest.config.js` + `__mocks__/*` (the only Jest setup in this repo's design-system packages).

## Global Constraints

- **Yarn only** — never `npm`/`pnpm`.
- **Mirror `@vuotto/web`/`@vuotto/mobile`'s package shape**, not `@ds/web`/`@ds/mobile`'s: flat `"."` export, `dist/` built by `tsup`, `peerDependencies` for `react`/`react-dom`/`react-native`. This was confirmed by reading `@vuotto/web`'s and `@ds/web`'s actual `package.json` files side by side — REB-66 explicitly asks to pick one pattern, and `@vuotto/*` is the one to follow since Industry is this repo's active replacement for Vuotto (see REB-53/54/55).
- **Ports:** `@industry/web` Storybook → **6010**, `@industry/mobile` Storybook → **6011**. Confirmed by reading every existing package's `storybook` script: `@ds/web`=6006, `@ds/mobile`=6007, `@vuotto/web`=6008, `@vuotto/mobile`=6009 — 6010/6011 are the first genuinely free pair.
- **No `react-native-paper` anywhere.** Industry has no dependency on it (confirmed: neither `@vuotto/mobile` nor this plan's `@industry/mobile` need it). When porting `@ds/mobile`'s `jest.config.js` as a template, drop its `react-native-paper` entry from `transformIgnorePatterns` — it doesn't apply here.
- **TypeScript strict + `noUncheckedIndexedAccess: true`** (`@repo/typescript-config/react-library.json`, which both new packages extend) — do not weaken this locally.
- **ESLint `--max-warnings 0`** — every lint warning is build-breaking.
- **No comments that restate the code.** Only comment a non-obvious invariant or a constraint invisible from the code itself. This user's standing preference is stricter than CLAUDE.md's literal exception — when in doubt, don't write the comment. (Applies to source files. The Jest mock files ported verbatim from `@ds/mobile/__mocks__/*` keep their existing comments unchanged — they are copied files, not new authorship, and rewriting another package's copied file to satisfy a stricter policy that package doesn't follow is out of scope here.)
- **`Frame` has no CSS file and no `react-native-svg` dependency.** The corner "+" marks are two literal child elements per corner (a 1px-wide full-height bar and a 1px-tall full-width bar), not `::before`/`::after` pseudo-elements — this is what lets both platforms implement `Frame` with plain inline/`style`-prop styling, matching `@vuotto/web`'s established convention of using `style` + CSS custom properties over per-component stylesheets (confirmed: `vuotto-web/src/styles.css` is reserved only for rules inline styles structurally cannot express — `@keyframes`, `@supports`, `::-webkit-scrollbar` — not general component classes).
- **Never remove the corner marks from a framed element** — `marks` defaults to `true` on both platforms; only an explicit `marks={false}` omits them. This is DESIGN-SYSTEM.md §7's explicit rule ("Nunca remova as marcas de um elemento emoldurado — elas são o sistema").
- **This is the first slice of a larger effort.** `Icon` (REB-64), `.duotone` (REB-63), and the Storybook foundation docs (REB-65) are deliberately out of scope for this plan — they land in a follow-up plan once these two workspaces exist. Do not add `lucide-react`/`lucide-react-native` dependencies, an `Icon` component, or a `theme/` folder in this plan; none of them are needed by `Frame` and adding them now is scope creep this plan's own tickets don't ask for.

---

## File Structure

```
packages/design-system/industry-web/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── eslint.config.mjs
├── README.md
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
└── src/
    ├── index.ts
    └── components/
        └── core/
            ├── Frame.tsx
            ├── Frame.stories.tsx
            └── index.ts

packages/design-system/industry-mobile/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── eslint.config.mjs
├── jest.config.js
├── jest.setup.js
├── jest.setup-after-env.js
├── README.md
├── __mocks__/
│   ├── react-native-animated-props.js
│   ├── react-native-animated.js
│   ├── react-native-safe-area-context.js
│   └── renderer-proxy.js
├── .storybook/
│   ├── main.ts
│   └── preview.tsx
└── src/
    ├── index.ts
    └── components/
        └── core/
            ├── Frame.tsx
            ├── Frame.test.tsx
            ├── Frame.stories.tsx
            └── index.ts

.github/workflows/
├── storybook-industry-web.yml
└── storybook-industry-mobile.yml
```

---

### Task 1: Scaffold `@industry/web` + `Frame` component (REB-66 web half + REB-62 web half)

**Files:**

- Create: `packages/design-system/industry-web/package.json`
- Create: `packages/design-system/industry-web/tsconfig.json`
- Create: `packages/design-system/industry-web/tsup.config.ts`
- Create: `packages/design-system/industry-web/eslint.config.mjs`
- Create: `packages/design-system/industry-web/.storybook/main.ts`
- Create: `packages/design-system/industry-web/src/components/core/Frame.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Frame.stories.tsx`
- Create: `packages/design-system/industry-web/src/components/core/index.ts`
- Create: `packages/design-system/industry-web/src/index.ts`

**Interfaces:**

- Produces: `Frame` React component — `interface FrameProps { as?: React.ElementType; marks?: boolean; children?: React.ReactNode; className?: string; style?: React.CSSProperties }`, default export shape `export function Frame(props: FrameProps)`. Re-exported from `src/components/core/index.ts` and `src/index.ts`. No other task in this plan consumes it, but this is the exact shape a later plan's `Button`/`Card` `framed` prop (REB-67/68, out of scope here) will build on.

- [ ] **Step 1: Create the package manifest**

`packages/design-system/industry-web/package.json`:

```json
{
  "name": "@industry/web",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "storybook": "storybook dev -p 6010",
    "build-storybook": "storybook build",
    "chromatic": "chromatic --exit-zero-on-changes"
  },
  "dependencies": {
    "@industry/tokens": "*"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "@storybook/addon-essentials": "^8.6.14",
    "@storybook/react": "^8.6.14",
    "@storybook/react-vite": "^8.6.14",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "chromatic": "^16.6.0",
    "eslint": "^9",
    "react": "^19",
    "react-dom": "^19",
    "storybook": "^8.6.14",
    "tsup": "^8",
    "typescript": "5.9.2",
    "vite": "^6"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`, `tsup.config.ts`, `eslint.config.mjs`**

`packages/design-system/industry-web/tsconfig.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`packages/design-system/industry-web/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

`packages/design-system/industry-web/eslint.config.mjs`:

```js
import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default config;
```

- [ ] **Step 3: Create the Storybook config**

`packages/design-system/industry-web/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

- [ ] **Step 4: Write the `Frame` component**

`packages/design-system/industry-web/src/components/core/Frame.tsx`:

```tsx
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_POSITIONS: Record<CornerPosition, CSSProperties> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  return (
    <i
      data-frame-corner={position}
      style={{
        position: 'absolute',
        width: 11,
        height: 11,
        color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
        ...CORNER_POSITIONS[position],
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          background: 'currentColor',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          background: 'currentColor',
        }}
      />
    </i>
  );
}

export interface FrameProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  as?: ElementType;
  marks?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Frame({ as: Tag = 'div', marks = true, children, style, ...rest }: FrameProps) {
  return (
    <Tag
      style={{
        position: 'relative',
        border: '1px solid var(--color-divider)',
        borderRadius: 0,
        ...style,
      }}
      {...rest}
    >
      {marks ? (
        <>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </>
      ) : null}
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: Write the Storybook stories**

`packages/design-system/industry-web/src/components/core/Frame.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Frame } from './Frame';

const meta: Meta<typeof Frame> = {
  title: 'Core/Frame',
  component: Frame,
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  render: () => <Frame style={{ width: 240, height: 160, background: 'var(--color-surface)' }} />,
};

export const WithoutMarks: Story = {
  render: () => (
    <Frame marks={false} style={{ width: 240, height: 160, background: 'var(--color-surface)' }} />
  ),
};

export const AsSection: Story = {
  render: () => (
    <Frame as="section" style={{ width: 240, padding: 'var(--space-4)' }}>
      <p style={{ margin: 0, color: 'var(--color-text)' }}>Framed content</p>
    </Frame>
  ),
};
```

- [ ] **Step 6: Write the barrel exports**

`packages/design-system/industry-web/src/components/core/index.ts`:

```ts
export { Frame } from './Frame';
export type { FrameProps } from './Frame';
```

`packages/design-system/industry-web/src/index.ts`:

```ts
export * from './components/core';
```

- [ ] **Step 7: Install dependencies and build**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn install
yarn workspace @industry/web build
```

Expected: exits 0, producing `packages/design-system/industry-web/dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`.

Run:

```sh
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
```

Expected: both exit 0.

- [ ] **Step 8: Verify Storybook builds statically**

Run:

```sh
yarn workspace @industry/web build-storybook
```

Expected: exits 0, producing `packages/design-system/industry-web/storybook-static/index.html`. This is the same check the CI workflow (Task 3) will run — confirming it works locally now avoids debugging CI later. Check that three story titles appear in the build output or `storybook-static/index.json` (if generated): `Core/Frame`.

```sh
grep -o '"title":"Core/Frame"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null | head -1 || grep -rl "Core/Frame" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match (exact grep target depends on the Storybook version's static output format — if the first form finds nothing, the second one will; either confirms the story registered).

- [ ] **Step 9: Commit**

```sh
git add packages/design-system/industry-web
git commit -m "feat(industry-web): scaffold package and implement Frame component"
```

---

### Task 2: Scaffold `@industry/mobile` + `Frame` component (REB-72 + REB-62 mobile half)

**Files:**

- Create: `packages/design-system/industry-mobile/package.json`
- Create: `packages/design-system/industry-mobile/tsconfig.json`
- Create: `packages/design-system/industry-mobile/tsup.config.ts`
- Create: `packages/design-system/industry-mobile/eslint.config.mjs`
- Create: `packages/design-system/industry-mobile/jest.config.js`
- Create: `packages/design-system/industry-mobile/jest.setup.js`
- Create: `packages/design-system/industry-mobile/jest.setup-after-env.js`
- Create: `packages/design-system/industry-mobile/__mocks__/react-native-animated-props.js`
- Create: `packages/design-system/industry-mobile/__mocks__/react-native-animated.js`
- Create: `packages/design-system/industry-mobile/__mocks__/react-native-safe-area-context.js`
- Create: `packages/design-system/industry-mobile/__mocks__/renderer-proxy.js`
- Create: `packages/design-system/industry-mobile/.storybook/main.ts`
- Create: `packages/design-system/industry-mobile/.storybook/preview.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Frame.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Frame.test.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Frame.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/index.ts`
- Create: `packages/design-system/industry-mobile/src/index.ts`

**Interfaces:**

- Consumes: `color` (specifically `color.divider`) from `@industry/tokens`'s `src/native/index.ts` (already built in the merged `@industry/tokens` package — REB-48).
- Produces: `Frame` RN component — `interface FrameProps { marks?: boolean; children?: React.ReactNode; style?: import('react-native').StyleProp<import('react-native').ViewStyle> }` (no `as` prop — RN has no tag polymorphism, unlike the DOM). Each corner `View` carries `testID={\`frame-corner-\${position}\`}` for the tests in this task.

- [ ] **Step 1: Create the package manifest**

`packages/design-system/industry-mobile/package.json`:

```json
{
  "name": "@industry/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "jest",
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "storybook": "storybook dev -p 6011",
    "build-storybook": "storybook build",
    "chromatic": "chromatic --exit-zero-on-changes"
  },
  "dependencies": {
    "@industry/tokens": "*"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-native": ">=0.72"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "@storybook/addon-essentials": "^8.6.14",
    "@storybook/react": "^8.6.14",
    "@storybook/react-vite": "^8.6.14",
    "@testing-library/react-native": "^12",
    "@types/react": "^19",
    "@types/react-native": "*",
    "@types/react-test-renderer": "^19",
    "chromatic": "^16.6.0",
    "eslint": "^9",
    "globals": "*",
    "react": "^19",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "^4 || ^5",
    "react-native-web": "^0.19",
    "react-test-renderer": "^19",
    "storybook": "^8.6.14",
    "tsup": "^8",
    "typescript": "5.9.2",
    "vite": "^6"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`, `tsup.config.ts`, `eslint.config.mjs`**

`packages/design-system/industry-mobile/tsconfig.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2022"],
    "types": ["react-native"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`packages/design-system/industry-mobile/tsup.config.ts`:

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-native'],
});
```

`packages/design-system/industry-mobile/eslint.config.mjs`:

```js
import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default config;
```

- [ ] **Step 3: Port the Jest setup from `@ds/mobile`**

`packages/design-system/industry-mobile/jest.config.js` (ported from `packages/design-system/mobile/jest.config.js`, with the `react-native-paper` entry dropped from `transformIgnorePatterns` per this plan's Global Constraints — Industry has no Paper dependency):

```js
const path = require('path');

const sharedReact = path.resolve(__dirname, '../../../node_modules/react');

/** @type {import('jest').Config} */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      { configFile: false, presets: ['@react-native/babel-preset'] },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '^react$': sharedReact,
    '^react/(.*)$': `${sharedReact}/$1`,
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
    '^react-native/Libraries/Animated/Animated$': '<rootDir>/__mocks__/react-native-animated.js',
    '^react-native/Libraries/Animated/nodes/AnimatedProps$':
      '<rootDir>/__mocks__/react-native-animated-props.js',
    '^react-native/Libraries/ReactNative/RendererProxy$': '<rootDir>/__mocks__/renderer-proxy.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};
```

`packages/design-system/industry-mobile/jest.setup.js` (verbatim copy of `packages/design-system/mobile/jest.setup.js`):

```js
// Suppress RN internal warnings in test output
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
```

`packages/design-system/industry-mobile/jest.setup-after-env.js` (verbatim copy of `packages/design-system/mobile/jest.setup-after-env.js`):

```js
// Mock the ReactNative renderer shim to avoid loading the pre-built
// ReactNativeRenderer-dev (which has a hard version check against React 19.2.3
// but the workspace uses a newer React). We provide a no-op stub that satisfies
// the AnimatedProps._connectAnimatedView path.
jest.mock('react-native/Libraries/Renderer/shims/ReactNative', () => ({
  default: {
    findNodeHandle: jest.fn(() => -1),
    findHostInstance_DEPRECATED: jest.fn(() => null),
    dispatchCommand: jest.fn(),
    sendAccessibilityEvent: jest.fn(),
    render: jest.fn(),
    unmountComponentAtNodeAndRemoveContainer: jest.fn(),
    unstable_batchedUpdates: jest.fn((fn) => fn()),
    isChildPublicInstance: jest.fn(() => false),
  },
}));
```

`packages/design-system/industry-mobile/__mocks__/react-native-animated-props.js` (verbatim copy):

```js
'use strict';

// Load the real AnimatedProps but patch __makeNative to be a no-op.
// This prevents the native renderer (react-native's pre-built 19.2.3) from
// being loaded in Jest, which would otherwise throw an "Incompatible React
// versions" error when the workspace react is a newer minor version.
const AnimatedProps = jest.requireActual('react-native/Libraries/Animated/nodes/AnimatedProps');

const OriginalAnimatedProps = AnimatedProps.default ?? AnimatedProps;

if (OriginalAnimatedProps && OriginalAnimatedProps.prototype) {
  OriginalAnimatedProps.prototype.__makeNative = function () {
    // no-op: skip native driver setup to avoid loading the RN renderer
  };
}

module.exports = AnimatedProps;
```

`packages/design-system/industry-mobile/__mocks__/react-native-animated.js` (verbatim copy):

```js
'use strict';

// Proxy to AnimatedMock so that useNativeDriver: true animations are replaced
// with immediate JS-side animations.  This prevents react-native's pre-built
// ReactNativeRenderer-dev (19.2.3) from being loaded and throwing an
// "Incompatible React versions" error when the workspace react is newer.
module.exports = require('react-native/Libraries/Animated/AnimatedMock');
```

`packages/design-system/industry-mobile/__mocks__/react-native-safe-area-context.js` (verbatim copy):

```js
'use strict';

const React = require('react');

const SafeAreaProvider = ({ children }) => children;
SafeAreaProvider.displayName = 'SafeAreaProvider';

const SafeAreaView = ({ children }) => children;
SafeAreaView.displayName = 'SafeAreaView';

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaInsetsContext: React.createContext({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
};
```

`packages/design-system/industry-mobile/__mocks__/renderer-proxy.js` (verbatim copy):

```js
'use strict';

// Safe mock for RendererProxy that avoids loading the pre-built
// ReactNativeRenderer-dev (which has a hard version check against React 19.2.3
// but the workspace uses a newer React). All methods are no-ops or return safe
// defaults so that Animated components can render in Jest without native setup.

module.exports = {
  findNodeHandle: jest.fn(() => -1),
  findHostInstance_DEPRECATED: jest.fn(() => null),
  dispatchCommand: jest.fn(),
  sendAccessibilityEvent: jest.fn(),
  getNodeFromInternalInstanceHandle: jest.fn(() => null),
  getPublicInstanceFromInternalInstanceHandle: jest.fn(() => null),
  getPublicInstanceFromRootTag: jest.fn(() => null),
  isChildPublicInstance: jest.fn(() => false),
  renderElement: jest.fn(),
  unmountComponentAtNodeAndRemoveContainer: jest.fn(),
  unstable_batchedUpdates: jest.fn((fn) => fn()),
};
```

- [ ] **Step 4: Write the failing test**

`packages/design-system/industry-mobile/src/components/core/Frame.test.tsx`:

```tsx
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Frame } from './Frame';

describe('Frame', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Frame>
        <Text>content</Text>
      </Frame>,
    );
    expect(getByText('content')).toBeTruthy();
  });

  it('renders four corner marks by default', () => {
    const { getByTestId } = render(<Frame />);
    expect(getByTestId('frame-corner-tl')).toBeTruthy();
    expect(getByTestId('frame-corner-tr')).toBeTruthy();
    expect(getByTestId('frame-corner-bl')).toBeTruthy();
    expect(getByTestId('frame-corner-br')).toBeTruthy();
  });

  it('omits corner marks when marks is false', () => {
    const { queryByTestId } = render(<Frame marks={false} />);
    expect(queryByTestId('frame-corner-tl')).toBeNull();
    expect(queryByTestId('frame-corner-tr')).toBeNull();
    expect(queryByTestId('frame-corner-bl')).toBeNull();
    expect(queryByTestId('frame-corner-br')).toBeNull();
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn install
yarn workspace @industry/mobile test
```

Expected: FAILS — `Frame.tsx` does not exist yet, so the import in `Frame.test.tsx` throws a module-not-found error (or, if the test runner can't even resolve the package's Jest config until `package.json`/`jest.config.js` from Steps 1–3 exist, confirm those are already in place before this step and the failure is specifically about the missing `./Frame` module, not a config problem).

- [ ] **Step 6: Write the `Frame` component**

`packages/design-system/industry-mobile/src/components/core/Frame.tsx`:

```tsx
import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_COLOR = alpha(color.text, 55);

const CORNER_POSITIONS: Record<CornerPosition, ViewStyle> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  return (
    <View
      testID={`frame-corner-${position}`}
      pointerEvents="none"
      style={[{ position: 'absolute', width: 11, height: 11 }, CORNER_POSITIONS[position]]}
    >
      <View
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: CORNER_COLOR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          backgroundColor: CORNER_COLOR,
        }}
      />
    </View>
  );
}

export interface FrameProps {
  marks?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Frame({ marks = true, children, style }: FrameProps) {
  return (
    <View style={[{ borderWidth: 1, borderColor: color.divider, borderRadius: 0 }, style]}>
      {marks ? (
        <>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </>
      ) : null}
      {children}
    </View>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run:

```sh
yarn workspace @industry/mobile test
```

Expected: PASS, 3/3 tests.

- [ ] **Step 8: Write the barrel exports**

`packages/design-system/industry-mobile/src/components/core/index.ts`:

```ts
export { Frame } from './Frame';
export type { FrameProps } from './Frame';
```

`packages/design-system/industry-mobile/src/index.ts`:

```ts
export * from './components/core';
```

- [ ] **Step 9: Create the Storybook config**

`packages/design-system/industry-mobile/.storybook/main.ts`:

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  async viteFinal(baseConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(baseConfig, {
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
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ],
      },
    });
  },
};

export default config;
```

`packages/design-system/industry-mobile/.storybook/preview.tsx`:

```tsx
import type { Preview } from '@storybook/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 0, left: 0, right: 0, bottom: 0 },
        }}
      >
        <Story />
      </SafeAreaProvider>
    ),
  ],
};

export default preview;
```

- [ ] **Step 10: Write the Storybook stories**

`packages/design-system/industry-mobile/src/components/core/Frame.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { color } from '@industry/tokens';
import { Frame } from './Frame';

const meta: Meta<typeof Frame> = {
  title: 'Core/Frame',
  component: Frame,
};

export default meta;
type Story = StoryObj<typeof Frame>;

export const Default: Story = {
  render: () => <Frame style={{ width: 240, height: 160, backgroundColor: color.surface }} />,
};

export const WithoutMarks: Story = {
  render: () => (
    <Frame marks={false} style={{ width: 240, height: 160, backgroundColor: color.surface }} />
  ),
};

export const WithContent: Story = {
  render: () => (
    <Frame style={{ width: 240, padding: 16, backgroundColor: color.surface }}>
      <Text style={{ color: color.text }}>Framed content</Text>
    </Frame>
  ),
};
```

- [ ] **Step 11: Build and verify everything together**

Run:

```sh
yarn workspace @industry/mobile build
```

Expected: exits 0, producing `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`.

Run:

```sh
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile test
```

Expected: all exit 0, tests still 3/3 passing.

- [ ] **Step 12: Verify Storybook builds statically**

Run:

```sh
yarn workspace @industry/mobile build-storybook
```

Expected: exits 0, producing `packages/design-system/industry-mobile/storybook-static/index.html`. Note (carry this into the README in Task 4, don't fix it here — it's an upstream `react-native-web` limitation, not a defect in this package): since `Frame` uses no `react-native-svg`, this Storybook preview should actually render correctly in the browser, unlike the icon-family components a future plan will add (which hit `react-native-web@0.19`'s lack of React 19 SVG support, per `vuotto-mobile/README.md`'s documented caveat).

- [ ] **Step 13: Commit**

```sh
git add packages/design-system/industry-mobile
git commit -m "feat(industry-mobile): scaffold package and implement Frame component"
```

---

### Task 3: CI — Chromatic workflows for both packages (REB-66 + REB-72 CI half)

**Files:**

- Create: `.github/workflows/storybook-industry-web.yml`
- Create: `.github/workflows/storybook-industry-mobile.yml`

**Interfaces:**

- Consumes: Task 1's `@industry/web` (`build-storybook` script) and Task 2's `@industry/mobile` (`build-storybook` script) — both already verified to work locally.
- Produces: nothing consumed by other tasks in this plan.

- [ ] **Step 1: Write the web workflow**

`.github/workflows/storybook-industry-web.yml` (adapted from `.github/workflows/storybook-vuotto-web.yml`: `vuotto-web`→`industry-web`, `vuotto-tokens`→`industry-tokens`, `VUOTTO_WEB`→`INDUSTRY_WEB`, `Vuotto Web`→`Industry Web`):

```yaml
name: Storybook Industry Web — Chromatic Deploy

on:
  push:
    branches:
      - main
    paths:
      - 'packages/design-system/industry-web/**'
      - 'packages/design-system/industry-tokens/**'
  pull_request:
    branches:
      - main
    paths:
      - 'packages/design-system/industry-web/**'
      - 'packages/design-system/industry-tokens/**'

jobs:
  chromatic:
    name: Publish Industry Web Storybook to Chromatic
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npx yarn install

      - name: Build @industry/tokens
        working-directory: packages/design-system/industry-tokens
        run: yarn build

      - name: Build Storybook
        working-directory: packages/design-system/industry-web
        run: yarn build-storybook

      - name: Publish to Chromatic
        id: chromatic
        working-directory: packages/design-system/industry-web
        run: yarn chromatic --storybook-build-dir=storybook-static
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN_INDUSTRY_WEB }}

      - name: Comment PR with Storybook URL
        if: github.event_name == 'pull_request' && steps.chromatic.outputs.storybookUrl != ''
        uses: actions/github-script@v7
        env:
          STORYBOOK_URL: ${{ steps.chromatic.outputs.storybookUrl }}
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `📖 Storybook (Industry Web) publicado no Chromatic: ${process.env.STORYBOOK_URL}`
            })
```

- [ ] **Step 2: Write the mobile workflow**

`.github/workflows/storybook-industry-mobile.yml` (adapted from `.github/workflows/storybook-vuotto-mobile.yml` the same way, plus its extra job-summary step):

```yaml
name: Storybook Industry Mobile — Chromatic Deploy

on:
  push:
    branches:
      - main
    paths:
      - "packages/design-system/industry-mobile/**"
      - "packages/design-system/industry-tokens/**"
  pull_request:
    branches:
      - main
    paths:
      - "packages/design-system/industry-mobile/**"
      - "packages/design-system/industry-tokens/**"

jobs:
  chromatic:
    name: Publish Industry Mobile Storybook to Chromatic
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npx yarn install

      - name: Build @industry/tokens
        working-directory: packages/design-system/industry-tokens
        run: yarn build

      - name: Build Storybook
        working-directory: packages/design-system/industry-mobile
        run: yarn build-storybook

      - name: Publish to Chromatic
        id: chromatic
        working-directory: packages/design-system/industry-mobile
        run: yarn chromatic --storybook-build-dir=storybook-static
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_PROJECT_TOKEN_INDUSTRY_MOBILE }}

      - name: Add Storybook URL to job summary
        if: steps.chromatic.outputs.storybookUrl != ''
        run: echo "📖 Storybook (Industry Mobile): ${{ steps.chromatic.outputs.storybookUrl }}" >> "$GITHUB_STEP_SUMMARY"

      - name: Comment PR with Storybook URL
        if: github.event_name == 'pull_request' && steps.chromatic.outputs.storybookUrl != ''
        uses: actions/github-script@v7
        env:
          STORYBOOK_URL: ${{ steps.chromatic.outputs.storybookUrl }}
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `📖 Storybook (Industry Mobile) publicado no Chromatic: ${process.env.STORYBOOK_URL}`
            })
```

- [ ] **Step 3: Validate workflow YAML syntax**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/storybook-industry-web.yml'))" && echo "web OK"
python3 -c "import yaml, sys; yaml.safe_load(open('.github/workflows/storybook-industry-mobile.yml'))" && echo "mobile OK"
```

Expected: `web OK` then `mobile OK`. (If `python3`/`yaml` isn't available, use `yarn dlx js-yaml .github/workflows/storybook-industry-web.yml >/dev/null && echo "web OK"` and the equivalent for mobile instead — either confirms the file parses as valid YAML, which is what this step is checking; GitHub Actions won't run it at all until this branch merges, so this is the only automated check available before that.)

- [ ] **Step 4: Note the required repo secrets (do not attempt to create them)**

These workflows reference two GitHub Actions repo secrets that don't exist yet: `CHROMATIC_PROJECT_TOKEN_INDUSTRY_WEB` and `CHROMATIC_PROJECT_TOKEN_INDUSTRY_MOBILE`. Creating a new Chromatic project and its token is an action outside this repo (chromatic.com) and involves an external service account — out of scope for this plan and not something to guess at. Until those secrets are added (by whoever owns the Chromatic account), both workflows will run and fail at the "Publish to Chromatic" step on any PR touching these packages. This is expected and matches how a brand-new `@ds/*`/`@vuotto/*` package's Chromatic workflow would behave before its secret is provisioned — not a bug to fix in this task. Mention this explicitly in the task's final report.

- [ ] **Step 5: Commit**

```sh
git add .github/workflows/storybook-industry-web.yml .github/workflows/storybook-industry-mobile.yml
git commit -m "ci(industry): add Chromatic Storybook workflows for web and mobile"
```

---

### Task 4: Package READMEs (documentation, no Jira subtask of its own — closes out REB-66/REB-72's deliverables)

**Files:**

- Create: `packages/design-system/industry-web/README.md`
- Create: `packages/design-system/industry-mobile/README.md`

**Interfaces:**

- Consumes: the final export surface of both packages from Tasks 1–2 (documents it — must not name an export that doesn't exist).
- Produces: nothing consumed by code — terminal task.

- [ ] **Step 1: Write the web README**

`packages/design-system/industry-web/README.md`:

```markdown
# @industry/web

Componentes React do **Industry** — o design system de blueprint sobre fundo escuro — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/web`](../vuotto-web/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook em `@storybook/react-vite`.

## Instalação

\`\`\`ts
import { Frame } from '@industry/web';
import '@industry/tokens/styles.css'; // tokens são globais, via CSS custom properties
\`\`\`

## Componentes

**`Frame`** — o objeto blueprint genérico: borda hairline reta (`--color-divider`) mais quatro marcas de registro `+` de 11px nos cantos, deslocadas 6px para fora. `props`: `as` (tag, padrão `div`), `marks` (padrão `true` — nunca remova as marcas de um elemento emoldurado, é regra do sistema), `children`, `style`, `className`, mais os demais atributos do elemento. Estilizado inteiramente via `style` inline + variáveis CSS de `@industry/tokens` (`--color-divider`, `--color-text`), sem folha de estilo própria — as marcas de canto são elementos filhos reais, não pseudo-elementos.

## Build

\`\`\`sh
yarn workspace @industry/web build # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/web storybook # dev, porta 6010
yarn workspace @industry/web build-storybook # build estático (usado pelo Chromatic)
\`\`\`

## Escopo

Este pacote nasce com um único componente, `Frame` (REB-62). `Icon` (REB-64), o wrapper `.duotone` (REB-63) e os controles/layout/navegação/feedback/dados (REB-67 a REB-71) chegam em PRs seguintes — a taxonomia de pastas (`src/components/{core,data,feedback,forms,navigation}`) já espelha `@vuotto/web` para receber esses componentes sem reestruturação.
```

- [ ] **Step 2: Write the mobile README**

`packages/design-system/industry-mobile/README.md`:

```markdown
# @industry/mobile

Componentes React Native do **Industry** — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/mobile`](../vuotto-mobile/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook via `react-native-web`. Diferente de `@vuotto/mobile`, tem um setup de Jest (porta do de [`@ds/mobile`](../mobile/README.md), sem a entrada de `react-native-paper` — este pacote não depende dele).

## Instalação

\`\`\`ts
import { Frame } from '@industry/mobile';
\`\`\`

## Componentes

**`Frame`** — o objeto blueprint genérico: `View` com borda hairline reta (`color.divider`) mais quatro `View`s de canto posicionadas absolutamente, cada uma desenhando um `+` de 11px com duas barras finas (não há pseudo-elemento no RN). `props`: `marks` (padrão `true` — mesma regra do `@industry/web`, nunca remova as marcas), `children`, `style`. Sem prop `as` — RN não tem polimorfismo de tag como o DOM.

## Build e testes

\`\`\`sh
yarn workspace @industry/mobile build # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/mobile test # Jest (node env)
yarn workspace @industry/mobile storybook # dev, porta 6011
yarn workspace @industry/mobile build-storybook # build estático (usado pelo Chromatic)
\`\`\`

## Limitação conhecida do Storybook

Herdada de `@vuotto/mobile`: `react-native-web@0.19.x` ainda não suporta React 19 para SVG — qualquer componente futuro baseado em `react-native-svg` (ex.: `Icon`) vai montar sem erro mas renderizar invisível neste preview de navegador. Não afeta o app real (Metro/Fabric renderiza SVG normalmente) — só o preview do Storybook. `Frame` não usa `react-native-svg`, então não é afetado.

## Escopo

Este pacote nasce com um único componente, `Frame` (REB-62). `Icon` (REB-64, que introduz a dependência `lucide-react-native` e vai exigir estender a config do Storybook com os plugins de stub de Fabric/SVG documentados em `@vuotto/mobile`), o wrapper `.duotone` (REB-63) e os controles/layout/navegação/feedback/dados (REB-73 a REB-77) chegam em PRs seguintes.
```

- [ ] **Step 3: Verify no export drift**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
cat packages/design-system/industry-web/src/index.ts packages/design-system/industry-web/src/components/core/index.ts
cat packages/design-system/industry-mobile/src/index.ts packages/design-system/industry-mobile/src/components/core/index.ts
```

Confirm the only export named in both `index.ts` files is `Frame` (plus its `FrameProps` type) — matches both READMEs' "Componentes" sections exactly.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/README.md packages/design-system/industry-mobile/README.md
git commit -m "docs(industry): add README for industry-web and industry-mobile"
```

---

## Self-Review Notes

- **Spec coverage:** REB-66 (workspace, build, Storybook, Chromatic) → Task 1 + Task 3. REB-72 (workspace, Jest, Storybook RN, Metro-resolver question) → Task 2 + Task 3 (the Metro resolver question is answered in Global Constraints: not needed inside the package itself, confirmed by reading both consuming apps' actual `metro.config.js` — it's an app-level concern for whenever an Industry-branded app exists, not a `@industry/mobile` deliverable). REB-62 (`Frame`, web + mobile, corner marks, never-remove rule) → Task 1 Step 4 + Task 2 Steps 4–7. REB-64 (`Icon`), REB-63 (`.duotone`), REB-65 (Storybook foundation docs) are explicitly out of scope (Global Constraints) — a follow-up plan.
- **Placeholder scan:** no TBD/TODO; every step has literal file content and literal expected command output. Task 3 Step 4 documents a real, unavoidable external-service gap (Chromatic tokens) rather than inventing a fake value for it.
- **Type consistency:** `FrameProps` (web, Task 1) and `FrameProps` (mobile, Task 2) are two distinct, intentionally different interfaces (web has `as`/`className`/DOM attributes, mobile has RN `style`/`StyleProp<ViewStyle>`) — both named identically because they're platform-specific implementations of the same design concept, matching how `@vuotto/web`/`@vuotto/mobile` name their own shared-concept components identically across packages. `color`/`alpha` imports in Task 2 match `@industry/tokens`'s actual `src/native/index.ts` export names (verified against the already-merged REB-48 work, not re-derived here).
