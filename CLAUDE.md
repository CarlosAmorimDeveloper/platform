# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo overview

Turborepo + Yarn Workspaces v1 monorepo. **Always use Yarn** — the lockfile and workspace resolution are Yarn-specific; `npm` and `pnpm` will break things.

```
apps/web/todo-app/          # Next.js 16 app (App Router) — deployed to Vercel
packages/design-system/
  web/                      # @ds/web — React components (CSS Modules + Tailwind v4)
  mobile/                   # @ds/mobile — React Native / NativeWind v4 config
  tokens/                   # @ds/tokens — shared design tokens (TS + CSS vars)
packages/eslint-config/     # @repo/eslint-config — ESLint v9 flat configs
packages/typescript-config/ # @repo/typescript-config — shared tsconfigs
```

## Git workflow

**Always create a feature branch before starting any new task.** Never develop directly on `main`.

```sh
git checkout -b feat/<short-description>   # new feature
git checkout -b fix/<short-description>    # bug fix
git checkout -b chore/<short-description>  # tooling / maintenance
```

Open a pull request targeting `main` when the work is ready for review.

## Commands

### From repo root

```sh
yarn install          # install all workspaces in one shot
yarn dev              # start todo-app + Storybook in parallel
yarn build            # build all packages and apps (respects turbo dep order)
yarn lint             # ESLint across all workspaces
yarn check-types      # TypeScript across all workspaces
yarn format           # Prettier write
yarn format:check     # Prettier check (CI)
```

### todo-app (`apps/web/todo-app`)

```sh
yarn dev --filter=todo-app  # or: cd apps/web/todo-app && yarn dev
yarn test                   # Jest (jsdom, ts-jest)
yarn test --watch            # watch mode
yarn test --testPathPattern=TaskItem  # run a single test file
```

### @ds/web (`packages/design-system/web`)

```sh
yarn workspace @ds/web storybook        # Storybook dev on :6006
yarn workspace @ds/web build-storybook  # static build
yarn workspace @ds/web generate:component  # turbo gen scaffold
```

### @ds/mobile (`packages/design-system/mobile`)

```sh
yarn workspace @ds/mobile test  # Jest (node env, babel-jest only)
```

## Architecture

### todo-app state

Redux Toolkit store with localStorage persistence. The `ReduxProvider` hydrates via `useEffect` to avoid SSR mismatches — do not access the store directly during server render.

Actions: `addTask`, `toggleTask`, `editTask`, `removeTask`, `hydrateState` (bulk replace for hydration).

`Task` model: `{ id: string (UUID), title: string, completed: boolean, createdAt: string (ISO 8601) }`.

### Design system layers

- **`@ds/tokens`** — the source of truth for colors, spacing, font sizes, radii. Exported as TypeScript constants and as CSS custom properties via `global.css`.
- **`@ds/web`** — React components that consume `@ds/tokens`. Uses CSS Modules (SCSS) + Tailwind v4. Documented in Storybook; visual regression tests run via Chromatic on every push/PR to `main` that touches `packages/design-system/web/`.
- **`@ds/mobile`** — NativeWind v4 configuration that maps `@ds/tokens` to Tailwind classes for React Native. Ships `tailwind.config.js`, `babel.config.js`, and `metro.config.js` ready for consuming apps. Tests run in Node env (not jsdom) with a minimal Babel config that bypasses `metro-react-native-babel-preset`.

### CI workflows

| Workflow        | Trigger                                          | What it does                                                                   |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| `coverage.yml`  | PR → main                                        | Runs Jest only on changed source files; enforces ≥ 95% coverage on those files |
| `deploy.yml`    | Push/PR → main (todo-app paths)                  | Vercel deploy                                                                  |
| `storybook.yml` | Push/PR → main (`packages/design-system/web/**`) | Chromatic publish                                                              |

## Next.js version note

`apps/web/todo-app` uses **Next.js 16** with the App Router. This version has breaking changes from prior versions — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code for this app, and heed deprecation notices.

## ESLint configs

Three flat-config exports from `@repo/eslint-config`:

- `base` — any TypeScript package
- `react-internal` — React packages (e.g. `@ds/web`)
- `next-js` — Next.js apps (e.g. `todo-app`)

`eslint-plugin-only-warn` converts errors to warnings in all configs.

## Storybook component scaffold

New `@ds/web` components can be scaffolded with `yarn workspace @ds/web generate:component` (Turborepo generator). Each component lives in its own directory under `packages/design-system/web/components/` with an `index.ts` re-export and a `.stories.tsx` file.
