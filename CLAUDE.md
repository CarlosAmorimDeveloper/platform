# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo overview

Turborepo + Yarn Workspaces v1 monorepo. **Always use Yarn** — the lockfile and workspace resolution are Yarn-specific; `npm` and `pnpm` will break things.

```
apps/web/todo-app/          # Next.js 16 app (App Router) — deployed to Vercel
apps/mobile/appointmate/    # Expo app — mental health check-in log (LGPD sensitive data)
apps/mobile/tickets-app/    # Expo app — multi-tenant ticketing, published on Play Store
packages/design-system/industry/
  web/                        # @industry/web — React components (Industry design system), no MUI/Emotion
  mobile/                     # @industry/mobile — React Native components (Industry design system), no React Native Paper
  tokens/                     # @industry/tokens — shared design tokens (TS + CSS vars), adopted by all 3 apps
packages/eslint-config/     # @repo/eslint-config — ESLint v9 flat configs
packages/typescript-config/ # @repo/typescript-config — shared tsconfigs
```

The Industry design system (`@industry/*`) is the design system used by all three apps (todo-app, tickets-app, appointmate), migrated to it in REB-88/89/90. Its previous generation, Vuotto Tech (`@vuotto/*`), was fully removed from the monorepo (REB-100) once the migration completed.

## Git workflow

**Always create a feature branch before starting any new task.** Never develop directly on `main`.

```sh
git checkout -b feat/<short-description>   # new feature
git checkout -b fix/<short-description>    # bug fix
git checkout -b chore/<short-description>  # tooling / maintenance
```

Open a pull request targeting `main` when the work is ready for review.

## Development guidelines

These rules apply to every workspace in this monorepo. They override generic default behavior — follow them even where they're stricter than what you'd otherwise do.

### Data protection (LGPD)

`apps/mobile/appointmate` stores **dado sensível de saúde** under LGPD (Lei 13.709/2018, Art. 5º II) — mood, sleep/energy/appetite/concentration, medication data, free-text clinical notes, all in the Firestore `forms` collection.

- **Never weaken a Firestore security rule** (`firestore.rules` in `appointmate` or `tickets-app`) without checking what data becomes exposed and to whom. The `hasOnly([...])` allow-list in `appointmate`'s rules exists specifically to stop undeclared fields from being written — extend it deliberately when adding a field, never remove it to "make a bug go away."
- **Never add a new Firestore query that isn't filtered by `userId`/ownership.** In `appointmate`, `read` in the security rules also governs `list` queries — an unfiltered query is denied outright, but the same discipline applies conceptually to `tickets-app`'s `workspace_id` scoping.
- **Do not introduce an analytics, crash-reporting, or telemetry SDK** (Sentry, Amplitude, Mixpanel, Firebase Analytics, etc.) into `appointmate` without explicit user sign-off — none exists today, and adding one silently would mean sensitive health-adjacent data starts flowing to a new third party.
- **Do not log form content.** Never `console.log`/`console.warn` a `FormValues` object, a Firestore document from `forms`, or any field derived from it — even for debugging. Log IDs and error codes, not payloads.
- **Auth tokens persist via `AsyncStorage`, not `expo-secure-store`.** If you're asked to harden token storage, that's the concrete gap — don't assume it's already hardware-backed.
- **PDF export (`expo-print`/`expo-sharing`) must stay local-and-share, not upload.** If a "send by email" or "sync to cloud" feature is ever requested, treat it as a new data-processing activity requiring its own legal-basis/consent conversation, not a trivial extension of the existing export button.
- **Minimize what you persist.** When adding a new field to any `forms`-like collection, ask whether it needs to exist at all before adding it to the schema and the rules allow-list — every field added is a field that has to be justified later.
- When in doubt about whether a change has LGPD implications, say so explicitly and ask rather than assuming it's fine — this is the one category of "obviously safe refactor" that isn't.

### Comments: default to none

Do not add comments that restate what the code already says. Before writing a comment, ask whether removing it would confuse a future reader — if not, don't write it. A comment is justified only for: a non-obvious invariant, a workaround for a specific external bug, a constraint that isn't visible from the code itself (e.g. _why_ `react-native-paper` is pinned to the local `node_modules` in `appointmate`'s `jest.config.js`), or a warning about something a future edit could easily break silently. Never write a comment that explains _what_ a function does when its name and signature already say so, and never reference the current task/ticket/PR in a comment — that context belongs in the commit message, not the file.

### Clean Code

- Names should make comments unnecessary: prefer `isDateOnOrAfterToday` over `checkDate`, `EMPTY_FORM_VALUES` over `defaults`.
- Small, single-purpose functions and components over large ones that branch on a mode/flag. If a screen component is doing data-fetching, validation, and rendering all inline and growing unwieldy, that's a signal to extract — but only when it's already happened, not preemptively.
- No dead code, no commented-out code, no unused exports. If it's not called anywhere, delete it rather than leaving it "in case."
- Don't add a parameter, prop, or config flag for a case that doesn't exist yet. Extend the API when the second real use case shows up, not in anticipation of one.
- Prefer explicit, narrow types over `any`/broad unions (`@typescript-eslint/no-explicit-any` is already a warn-level rule repo-wide — treat it as a hard rule, since `--max-warnings 0` fails the build on it anyway).
- Keep validation, formatting, and business-rule logic in `src/domain/` (or the equivalent plain-function layer), not inline in a component's JSX or event handler — see `isDateOnOrAfterToday`, `formatDateInput`, `isWithinTimeFilter` in `appointmate` for the pattern to follow.

### Clean Architecture

Every app in this repo already follows the same layering — keep new code inside it rather than reaching across layers:

- **Domain (`src/domain/`)** — plain TypeScript, no React, no Firebase, no navigation imports. Pure functions and types (`form.ts`, `pdf.ts`, `timeFilter.ts` in `appointmate`). This layer should be testable with zero mocks.
- **Services (`src/services/`)** — the only place that talks to Firebase (or any external system). Screens and hooks call a service function; they never import `firebase/firestore` or `firebase/auth` directly.
- **Screens/Components (`src/screens/`, `src/components/`)** — composition and presentation. Business rules belong in `domain/`, not here; data access belongs in `services/`, not here.
- **Design system (`@industry/web`, `@industry/mobile`, `@industry/tokens`)** — the only place that owns visual styling primitives (colors, spacing, component variants). App-level code should not hardcode a hex color or a magic spacing number that already exists as a token.
- Dependencies point inward: screens depend on services and domain; services depend on domain; domain depends on nothing app-specific. Never have `src/domain/` import from `src/screens/` or `src/services/`.
- Cross-cutting state (`AuthContext` in `appointmate`, the Zustand `useAuthStore` in `tickets-app`, the Redux store in `todo-app`) is a single, explicit place per app — don't introduce a second competing state mechanism in the same app for the same concern.

### Language & framework knowledge

- **TypeScript everywhere**, `strict: true` + `noUncheckedIndexedAccess: true` (`@repo/typescript-config/base.json`) — don't disable strictness locally to make a type error go away; fix the type.
- **Next.js 16 (`todo-app`)** has real breaking changes vs. older training data — read `node_modules/next/dist/docs/` for the relevant API before writing App Router code here. Never read/write `localStorage` or the Redux store outside a `useEffect` (SSR hydration safety, see `ReduxProvider.tsx`).
- **React 19** across all apps — no `React.FC`, prefer plain function components; hooks rules are enforced by `eslint-plugin-react-hooks` in `react-internal`/`next-js` configs.
- **Expo/React Native 0.81.5 (`tickets-app`, `appointmate`)** — both apps pin `react`/`react-native`/`react-native-paper` to their own local `node_modules` via a custom Metro `resolveRequest` (see either app's `metro.config.js`). Do not "simplify" that resolver — it exists because a hoisted, differently-versioned copy of these packages breaks at runtime with an opaque renderer error. When adding a new native-module dependency to a mobile app, check whether it also needs a `nohoist` entry in the root `package.json`.
- **React Native Paper + Portals (`Dialog`, `Menu`)** — these rely on React Context identity to find their `PortalHost`. If a Portal-based component works in the app but crashes with an opaque error in Jest, suspect a dual-module-instance problem before anything else (see `appointmate/jest.config.js`'s `react-native-paper` `moduleNameMapper` entry and its inline comment for the full explanation).
- **Firebase (`firebase` v11, modular SDK)** — always use `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })` on React Native, never bare `getAuth()`, or session persistence silently breaks. Firestore composite indexes (`firestore.indexes.json`) are required whenever a query combines an equality filter with an `orderBy` on a different field — the local emulator won't catch a missing index, but production will fail at query time.
- **react-hook-form (`appointmate`)** — validation rules live on the `Controller`, not hand-rolled in `onChange` handlers. A "save draft" path that must skip validation should read `getValues()` directly rather than going through `handleSubmit`.
- **ESLint (`eslint-plugin-only-warn`)** — every rule in this repo is surfaced as a warning, not an error; `--max-warnings 0` in each workspace's `lint` script is what actually enforces it. Treat any lint warning as build-breaking, not advisory.

## Commands

### From repo root

```sh
yarn install          # install all workspaces in one shot
yarn dev              # runs each workspace's persistent dev script in parallel (todo-app's `next dev`, design-system packages' `tsup --watch` — not Storybook, start that per-package with `yarn workspace <pkg> storybook`)
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
yarn test --testPathPatterns=TaskItem  # run a single test file
```

Jest 30 (used by every workspace, hoisted at the repo root) renamed `--testPathPattern` to `--testPathPatterns`. The singular form exits 1 with a "was replaced by" error — the same applies to the mobile workspaces' `yarn test`.

### @industry/web (`packages/design-system/industry/web`)

```sh
yarn workspace @industry/web storybook        # Storybook dev on :6010
yarn workspace @industry/web build-storybook  # static build
```

### @industry/mobile (`packages/design-system/industry/mobile`)

```sh
yarn workspace @industry/mobile storybook  # Storybook dev on :6011
yarn workspace @industry/mobile jest       # Jest (node env, babel-jest only)
```

## Architecture

### todo-app state

Redux Toolkit store with localStorage persistence. The `ReduxProvider` hydrates via `useEffect` to avoid SSR mismatches — do not access the store directly during server render.

Actions: `addTask`, `toggleTask`, `editTask`, `removeTask`, `hydrateState` (bulk replace for hydration).

`Task` model: `{ id: string (UUID), title: string, completed: boolean, createdAt: string (ISO 8601) }`.

### Design system layers

- **`@industry/tokens`** — the source of truth for colors, spacing, font sizes. Exported as TypeScript constants and as CSS custom properties via `styles.css`.
- **`@industry/web`** — React components, own implementation (no MUI/Emotion), themed from `@industry/tokens` via CSS custom properties. Documented in Storybook; visual regression tests run via Chromatic on every push/PR to `main` that touches `packages/design-system/industry/web/` or `industry/tokens/`.
- **`@industry/mobile`** — React Native components, own implementation (no React Native Paper), themed from `@industry/tokens` via `StyleSheet.create`. Tests run in Node env (not jsdom) with a minimal Babel config that bypasses `metro-react-native-babel-preset`.

### CI workflows

| Workflow                        | Trigger                                                                                           | What it does                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `coverage.yml`                  | PR → main (todo-app, tickets-app, appointmate, industry/{web,mobile,tokens} paths)                | Runs Jest only on changed source files; enforces ≥ 95% coverage on those files |
| `deploy.yml`                    | Push/PR → main (todo-app, industry/web, industry/tokens paths)                                    | Vercel deploy                                                                  |
| `mobile-apps.yml`               | PR → main (mobile apps, industry/mobile, industry/tokens, eslint-config, typescript-config paths) | Lint/check-types/test for appointmate + tickets-app                            |
| `storybook-industry-web.yml`    | Push/PR → main (industry/web, industry/tokens paths)                                              | Chromatic publish for `@industry/web`                                          |
| `storybook-industry-mobile.yml` | Push/PR → main (industry/mobile, industry/tokens paths)                                           | Chromatic publish for `@industry/mobile`                                       |
| `version.yml`                   | Push → main (`.changeset/**`)                                                                     | Opens/updates the Changesets "Version Packages" PR                             |
| `copilot-review.yml`            | PR opened/synchronized (any)                                                                      | Requests a Copilot code review                                                 |
| `auto-update-prs.yml`           | Push → main                                                                                       | Merges `main` into open PRs                                                    |

## Next.js version note

`apps/web/todo-app` uses **Next.js 16** with the App Router. This version has breaking changes from prior versions — APIs, conventions, and file structure may differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code for this app, and heed deprecation notices.

## ESLint configs

Three flat-config exports from `@repo/eslint-config`:

- `base` — any TypeScript package
- `react-internal` — React packages (e.g. `@industry/web`)
- `next-js` — Next.js apps (e.g. `todo-app`)

`eslint-plugin-only-warn` converts errors to warnings in all configs.
