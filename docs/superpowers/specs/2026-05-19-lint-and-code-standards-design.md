# Lint & Code Standards — Design Spec

**Date:** 2026-05-19
**Branch:** to be created from `main`

---

## Goal

Configure ESLint, Prettier, and pre-commit hooks consistently across all workspaces in the monorepo, and fix the pre-existing TypeScript/NativeWind issues in `@ds/mobile`.

---

## Current State

| Workspace | ESLint | Lint script | Status |
|---|---|---|---|
| `@ds/tokens` | ✗ | ✗ | Missing |
| `@ds/mobile` | ✗ | ✗ | Missing + TS errors |
| `@ds/web` | ✓ | ✓ | Failing (3 warnings, `--max-warnings 0`) |
| `todo-app` | ✓ | ✓ | Inconsistent config |
| `@repo/eslint-config` | — | — | No changes needed |

**Prettier:** `.prettierrc` exists at root with correct settings. No `.prettierignore`.

**Pre-commit hooks:** None. Developers can commit with lint broken.

**NativeWind (`@ds/mobile`):** `nativewind` and `react-native` are `peerDependencies` only — not `devDependencies` — so TypeScript can't find their types. Errors:
- `Cannot find module 'nativewind'`
- `Cannot find module 'react-native'`
- `className` prop not recognised on `Pressable` / `Text`

---

## Design

### 1. ESLint — per workspace

**`@ds/tokens`** — new `eslint.config.mjs`:
```js
import { config } from '@repo/eslint-config/base';
export default config;
```
Add to `package.json` scripts: `"lint": "eslint . --max-warnings 0"`
Add to `package.json` devDependencies: `"@repo/eslint-config": "*"`, `"eslint": "^9"`

**`@ds/mobile`** — new `eslint.config.mjs`:
```js
import { config } from '@repo/eslint-config/base';
export default config;
```
Add to `package.json` scripts: `"lint": "eslint . --max-warnings 0"`
Add to `package.json` devDependencies: `"@repo/eslint-config": "*"`, `"eslint": "^9"`

Rationale: both are TypeScript-only libraries with no browser globals. The `base` preset covers TypeScript + turbo env vars. The `react-internal` preset is for browser React only.

**`@ds/web`** — fix 3 active warnings, no config changes:
- `Button.tsx` line 1: change `import { ButtonHTMLAttributes }` → `import type { ButtonHTMLAttributes }`
- `Input.tsx` line 1: change `import { ... }` → `import type { ... }` for type-only imports
- `Input.tsx`: remove unused `props` parameter (or prefix with `_`)

**`todo-app`** — replace current `eslint.config.mjs`:
```js
// Current (inconsistent): imports base + eslint-config-next directly
// New (aligned): uses the shared @repo/eslint-config/next-js preset
import { nextJsConfig } from '@repo/eslint-config/next-js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextJsConfig,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
```

### 2. NativeWind types fix (`@ds/mobile`)

**`package.json`** — add to `devDependencies`:
```json
"nativewind": "^4.0.36",
"react-native": ">=0.72"
```

**`tsconfig.json`** — extend `types` array:
```json
"types": ["react-native", "nativewind/types"]
```

No component code changes needed. NativeWind already configures Tailwind (`tailwind.config.js`), Babel (`babel.config.js`), and Metro (`metro.config.js`).

### 3. Pre-commit hooks

**Strategy:** Lint-staged on staged files + global `check-types` on every commit (Option A).

**Install at root:**
- `husky`
- `lint-staged`

**`lint-staged.config.mjs`** at root:
```js
export default {
  '**/*.{ts,tsx,js,mjs,cjs}': ['eslint --fix', 'prettier --write'],
  '**/*.{json,css,md}':        ['prettier --write'],
};
```

**`.husky/pre-commit`:**
```sh
#!/bin/sh
yarn lint-staged
yarn check-types
```

**`package.json`** root — add `prepare` script:
```json
"prepare": "husky"
```

The `prepare` lifecycle runs automatically after `yarn install`, so new developers get hooks without a manual step.

**Tradeoff accepted:** `yarn check-types` runs all 5 workspaces on every commit (~10–15s). Acceptable for this repo size. A workspace-aware approach would be faster but adds significant complexity.

### 4. `.prettierignore`

New file at repo root:
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

---

## Files Changed

| File | Action |
|---|---|
| `packages/design-system/tokens/eslint.config.mjs` | Create |
| `packages/design-system/tokens/package.json` | Add lint script + eslint devDeps |
| `packages/design-system/mobile/eslint.config.mjs` | Create |
| `packages/design-system/mobile/package.json` | Add lint script + eslint devDeps + nativewind/react-native devDeps |
| `packages/design-system/mobile/tsconfig.json` | Add `nativewind/types` to types array |
| `packages/design-system/web/components/Button/Button.tsx` | Fix `import type` |
| `packages/design-system/web/components/Input/Input.tsx` | Fix `import type` + remove unused param |
| `apps/web/todo-app/eslint.config.mjs` | Replace with `@repo/eslint-config/next-js` |
| `.prettierignore` | Create |
| `.husky/pre-commit` | Create |
| `lint-staged.config.mjs` | Create |
| `package.json` (root) | Add `prepare` script + husky + lint-staged devDeps |
| `yarn.lock` | Updated by yarn install |

---

## Verification

After implementation, all of the following must pass:

```sh
yarn lint          # 0 errors, 0 warnings across all workspaces
yarn check-types   # 0 errors across all workspaces (except @ds/mobile pre-existing nativewind issues fixed)
yarn format:check  # 0 formatting differences
```

And a test commit must trigger the pre-commit hook successfully.
