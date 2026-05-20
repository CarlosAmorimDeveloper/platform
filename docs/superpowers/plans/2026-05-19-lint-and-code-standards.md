# Lint & Code Standards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure ESLint, Prettier, and pre-commit hooks consistently across all five workspaces, and fix the pre-existing NativeWind TypeScript errors in `@ds/mobile`.

**Architecture:** Each workspace gets its own `eslint.config.mjs` that re-exports from the shared `@repo/eslint-config` preset. Husky + lint-staged enforce lint/format on staged files at commit time; `yarn check-types` via turbo runs on every commit. All changes land in one PR on `chore/lint-and-code-standards`.

**Tech Stack:** ESLint v9 (flat config), `@repo/eslint-config` shared presets, Prettier, Husky v9, lint-staged, NativeWind v4, turbo.

---

## File Map

| File                                                             | Action  | Purpose                                                               |
| ---------------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `packages/design-system/tokens/eslint.config.mjs`                | Create  | ESLint config for @ds/tokens                                          |
| `packages/design-system/tokens/package.json`                     | Modify  | Add `lint` script + ESLint devDeps                                    |
| `packages/design-system/mobile/eslint.config.mjs`                | Create  | ESLint config for @ds/mobile (ignores CJS config files)               |
| `packages/design-system/mobile/package.json`                     | Modify  | Add `lint` script + ESLint devDeps + NativeWind/RN devDeps            |
| `packages/design-system/mobile/tsconfig.json`                    | Modify  | Add `nativewind/types` to resolve `className` prop errors             |
| `packages/design-system/mobile/src/components/Button/Button.tsx` | Modify  | Remove unused `import React` (new JSX transform, React not needed)    |
| `packages/design-system/web/components/Button/Button.tsx`        | Modify  | Fix `import type` for type-only import                                |
| `packages/design-system/web/components/Input/Input.tsx`          | Modify  | Fix `import type` + rename `...props` → `..._props`                   |
| `apps/web/todo-app/eslint.config.mjs`                            | Replace | Use `@repo/eslint-config/next-js` instead of raw `eslint-config-next` |
| `.prettierignore`                                                | Create  | Exclude generated/lock files from Prettier                            |
| `lint-staged.config.mjs`                                         | Create  | Per-extension lint + format commands for staged files                 |
| `.husky/pre-commit`                                              | Create  | Git hook: lint-staged + check-types                                   |
| `package.json` (root)                                            | Modify  | Add `prepare: husky` + husky/lint-staged devDeps                      |
| `yarn.lock`                                                      | Updated | After yarn install                                                    |

---

## Task 1 — Add lint to `@ds/tokens`

**Files:**

- Create: `packages/design-system/tokens/eslint.config.mjs`
- Modify: `packages/design-system/tokens/package.json`

- [ ] **Verify current state: lint command is missing**

```bash
yarn workspace @ds/tokens lint
```

Expected: `error Command "lint" not found.`

- [ ] **Create `packages/design-system/tokens/eslint.config.mjs`**

```js
import { config } from '@repo/eslint-config/base';
export default config;
```

- [ ] **Update `packages/design-system/tokens/package.json`**

Add `lint` to scripts and two devDependencies:

```json
{
  "name": "@ds/tokens",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./global.css": "./src/global.css"
  },
  "scripts": {
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "eslint": "^9",
    "typescript": "5.9.2"
  }
}
```

- [ ] **Run `yarn install`** to link the new devDeps

```bash
yarn install
```

- [ ] **Run lint and verify it passes**

```bash
yarn workspace @ds/tokens lint
```

Expected: exits 0 with no output.

- [ ] **Commit**

```bash
git add packages/design-system/tokens/eslint.config.mjs packages/design-system/tokens/package.json yarn.lock
git commit -m "chore(tokens): add ESLint config"
```

---

## Task 2 — Fix NativeWind TypeScript errors in `@ds/mobile`

**Files:**

- Modify: `packages/design-system/mobile/package.json`
- Modify: `packages/design-system/mobile/tsconfig.json`

- [ ] **Verify current failures**

```bash
yarn workspace @ds/mobile check-types
```

Expected output includes:

```
src/index.ts(1,46): error TS2307: Cannot find module 'nativewind'
src/index.ts(2,34): error TS2307: Cannot find module 'react-native'
src/components/Button/Button.tsx(29,7): error TS2322: Property 'className' does not exist
```

- [ ] **Add `nativewind` and `react-native` to `@ds/mobile` devDependencies**

Open `packages/design-system/mobile/package.json` and update `devDependencies`:

```json
{
  "name": "@ds/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "test": "jest",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@ds/tokens": "*"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "@types/react-native": "*",
    "jiti": "^1.21.0",
    "nativewind": "^4.0.36",
    "react-native": ">=0.72",
    "tailwindcss": "^3.4.17",
    "typescript": "5.9.2"
  },
  "peerDependencies": {
    "nativewind": "^4.0.36",
    "react": ">=18",
    "react-native": ">=0.72"
  }
}
```

- [ ] **Update `packages/design-system/mobile/tsconfig.json`** to add `nativewind/types`

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2022"],
    "types": ["react-native", "nativewind/types"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Run `yarn install`** to install the new devDeps

```bash
yarn install
```

- [ ] **Verify `check-types` now passes**

```bash
yarn workspace @ds/mobile check-types
```

Expected: exits 0 with no output.

- [ ] **Commit**

```bash
git add packages/design-system/mobile/package.json packages/design-system/mobile/tsconfig.json yarn.lock
git commit -m "fix(mobile): add nativewind + react-native devDeps to resolve TypeScript errors"
```

---

## Task 3 — Add lint to `@ds/mobile`

**Files:**

- Create: `packages/design-system/mobile/eslint.config.mjs`
- Modify: `packages/design-system/mobile/package.json`
- Modify: `packages/design-system/mobile/src/components/Button/Button.tsx`

**Context:** The mobile package has CJS config files at its root (`jest.config.js`, `metro.config.js`, `babel.config.js`, `tailwind.config.js`, `tailwind-utils.js`) that use `require()` and `module.exports`. TypeScript ESLint's `no-require-imports` rule would flag these. They are ignored explicitly. Additionally, `Button.tsx` imports `React` which is unused under the new JSX transform (`"jsx": "react-jsx"` via `react-library.json`) and must be removed.

- [ ] **Create `packages/design-system/mobile/eslint.config.mjs`**

```js
import { config } from '@repo/eslint-config/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...config,
  {
    ignores: ['*.config.js', 'tailwind-utils.js'],
  },
]);
```

- [ ] **Add `lint` script and ESLint devDeps to `packages/design-system/mobile/package.json`**

```json
{
  "name": "@ds/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "test": "jest",
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0"
  },
  "dependencies": {
    "@ds/tokens": "*"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "@types/react-native": "*",
    "eslint": "^9",
    "jiti": "^1.21.0",
    "nativewind": "^4.0.36",
    "react-native": ">=0.72",
    "tailwindcss": "^3.4.17",
    "typescript": "5.9.2"
  },
  "peerDependencies": {
    "nativewind": "^4.0.36",
    "react": ">=18",
    "react-native": ">=0.72"
  }
}
```

- [ ] **Run `yarn install`**

```bash
yarn install
```

- [ ] **Run lint to reveal issues**

```bash
yarn workspace @ds/mobile lint
```

Expected: warns about unused `React` import in `Button.tsx`.

- [ ] **Fix `packages/design-system/mobile/src/components/Button/Button.tsx`** — remove unused React import and replace `React.ReactNode` with inline type import

`React` is not in the global namespace with `"jsx": "react-jsx"`, so `React.ReactNode` would break TypeScript after removing the import. Use `import type { ReactNode }` instead.

```tsx
import type { ReactNode } from 'react';
import { Pressable, Text, type PressableProps } from 'react-native';
import { getContainerClasses, getTextClasses } from './button-classes';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: PressableProps['onPress'];
  className?: string;
  testID?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onPress,
  className = '',
  testID,
}: ButtonProps) {
  return (
    <Pressable
      className={getContainerClasses(variant, size, disabled, className)}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text className={getTextClasses(variant, size)}>{children}</Text>
    </Pressable>
  );
}
```

- [ ] **Run lint again to verify 0 warnings**

```bash
yarn workspace @ds/mobile lint
```

Expected: exits 0 with no output.

- [ ] **Run tests to confirm Button still works**

```bash
yarn workspace @ds/mobile test
```

Expected: all tests pass.

- [ ] **Commit**

```bash
git add packages/design-system/mobile/eslint.config.mjs packages/design-system/mobile/package.json packages/design-system/mobile/src/components/Button/Button.tsx yarn.lock
git commit -m "chore(mobile): add ESLint config and fix unused React import"
```

---

## Task 4 — Fix `@ds/web` lint warnings

**Files:**

- Modify: `packages/design-system/web/components/Button/Button.tsx`
- Modify: `packages/design-system/web/components/Input/Input.tsx`

- [ ] **Verify current failures**

```bash
yarn workspace @ds/web lint
```

Expected: 3 warnings → exits 1 (`--max-warnings 0`).

```
Button.tsx:1:1  warning  All imports in the declaration are only used as types. Use `import type`
Input.tsx:1:1   warning  All imports in the declaration are only used as types. Use `import type`
Input.tsx:29:6  warning  'props' is defined but never used
```

- [ ] **Fix `packages/design-system/web/components/Button/Button.tsx` line 1**

Change:

```tsx
import { ButtonHTMLAttributes } from 'react';
```

To:

```tsx
import type { ButtonHTMLAttributes } from 'react';
```

- [ ] **Fix `packages/design-system/web/components/Input/Input.tsx`**

Two changes in one edit:

1. Line 1 — use `import type`:

```tsx
import type { InputHTMLAttributes } from 'react';
```

2. Line 29 — rename rest param to satisfy `argsIgnorePattern: '^_'`:

```tsx
  ..._props
}: InputProps) {
```

Full updated destructure (lines 16–30):

```tsx
export function Input({
  type = "text",
  variant = "default",
  className,
  value,
  onChange,
  onBlur,
  onKeyDown,
  disabled,
  placeholder,
  autoFocus,
  checked,
  "aria-label": ariaLabel,
  ..._props
}: InputProps) {
```

- [ ] **Run lint and verify 0 warnings**

```bash
yarn workspace @ds/web lint
```

Expected: exits 0 with no output.

- [ ] **Run TypeScript check**

```bash
yarn workspace @ds/web check-types
```

Expected: exits 0.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Button/Button.tsx packages/design-system/web/components/Input/Input.tsx
git commit -m "fix(ds-web): resolve ESLint warnings — import type + unused rest param"
```

---

## Task 5 — Align `todo-app` ESLint config

**Files:**

- Modify: `apps/web/todo-app/eslint.config.mjs`

**Context:** The current config manually composes `@repo/eslint-config/base` + raw `eslint-config-next` imports. The shared `@repo/eslint-config/next-js` already bundles everything (base + Next.js plugin + React + React Hooks + global ignores). Using it directly matches the pattern in `@ds/web`.

- [ ] **Replace `apps/web/todo-app/eslint.config.mjs`**

```js
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default nextJsConfig;
```

- [ ] **Run lint and verify it passes**

```bash
yarn workspace todo-app lint
```

Expected: exits 0 with no output (or the same warnings as before, if any existed).

- [ ] **Commit**

```bash
git add apps/web/todo-app/eslint.config.mjs
git commit -m "chore(todo-app): align ESLint config to use @repo/eslint-config/next-js"
```

---

## Task 6 — Add `.prettierignore`

**Files:**

- Create: `.prettierignore`

- [ ] **Create `.prettierignore` at repo root**

```
node_modules
.next
dist
.turbo
build
out
coverage
*.lock
```

- [ ] **Verify `format:check` still passes**

```bash
yarn format:check
```

Expected: exits 0 (no formatting differences in tracked files).

- [ ] **Commit**

```bash
git add .prettierignore
git commit -m "chore: add .prettierignore"
```

---

## Task 7 — Install Husky + lint-staged + configure pre-commit hook

**Files:**

- Modify: `package.json` (root)
- Create: `lint-staged.config.mjs`
- Create: `.husky/pre-commit`

- [ ] **Add `husky`, `lint-staged`, and `prepare` script to root `package.json`**

Add to `devDependencies`:

```json
"husky": "^9",
"lint-staged": "^15"
```

Add to `scripts` (alongside existing scripts):

```json
"prepare": "husky"
```

The root `scripts` block should look like:

```json
"scripts": {
  "build": "turbo run build",
  "dev": "turbo run dev",
  "lint": "turbo run lint",
  "format": "prettier --write \"**/*.{ts,tsx,js,mjs,cjs,json,md,css}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,mjs,cjs,json,md,css}\"",
  "check-types": "turbo run check-types",
  "prepare": "husky"
}
```

- [ ] **Run `yarn install`** — installs packages and runs `prepare: husky` to set up Git hook infrastructure

```bash
yarn install
```

Expected: Husky prints `husky - Git hooks installed`.

- [ ] **Create `lint-staged.config.mjs` at repo root**

```js
export default {
  '**/*.{ts,tsx,js,mjs,cjs}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,css,md}': ['prettier --write'],
};
```

- [ ] **Create `.husky/pre-commit`**

```sh
yarn lint-staged
yarn check-types
```

- [ ] **Make the hook executable**

```bash
chmod +x .husky/pre-commit
```

- [ ] **Verify the hook runs on a dry commit**

Stage a trivial change (e.g., add a blank line to a `.md` file), then attempt to commit:

```bash
echo "" >> README.md
git add README.md
git commit -m "test: verify pre-commit hook"
```

Expected: lint-staged runs (prints filenames processed), then `yarn check-types` runs (prints turbo output), commit succeeds.

Then revert:

```bash
git reset HEAD~1
git checkout README.md
```

- [ ] **Run full lint + check-types + format:check one last time**

```bash
yarn lint && yarn check-types && yarn format:check
```

Expected: all three exit 0.

- [ ] **Commit**

```bash
git add lint-staged.config.mjs .husky/pre-commit package.json yarn.lock
git commit -m "chore: add Husky pre-commit hook with lint-staged and TypeScript check"
```

---

## Final Verification

After all tasks are complete, run the full suite:

```bash
yarn lint          # Expected: Tasks: N successful, N total — no failures
yarn check-types   # Expected: Tasks: N successful, N total — no failures
yarn format:check  # Expected: exits 0
```

Then open a PR targeting `main` from `chore/lint-and-code-standards`.
