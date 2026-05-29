# Jest Setup (tickets-app) + @ds/mobile Test Co-location Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Jest in the `tickets-app` so all co-located `.test.ts(x)` stubs run; simultaneously migrate `@ds/mobile` tests from `__tests__/` to co-located component folders; wire everything into the turbo `test` pipeline.

**Architecture:** Both packages use `@react-native/jest-preset` + React deduplication via `moduleNameMapper` (routing all `react` imports to the single React bundled inside `react-test-renderer`). This avoids the "invalid hook call" crash caused by multiple React instances in the same Jest run. The `tickets-app` adds a `NavigationContainer` wrapper in its `test-utils` because screens use `useNavigation`.

**Tech Stack:** Jest 30, `@react-native/jest-preset`, `babel-jest` + `babel-preset-expo`, `@testing-library/react-native ^12`, `react-test-renderer ^19`, Turbo 2.

---

## File Map

### tickets-app (all new)

- `apps/mobile/tickets-app/jest.config.js` — Jest configuration
- `apps/mobile/tickets-app/jest.setup.js` — suppress NativeEventEmitter warnings
- `apps/mobile/tickets-app/jest.setup-after-env.js` — mock ReactNative renderer shim
- `apps/mobile/tickets-app/__mocks__/react-native-safe-area-context.js` — mock SafeAreaProvider/useSafeAreaInsets
- `apps/mobile/tickets-app/__mocks__/react-native-animated.js` — route Animated to AnimatedMock
- `apps/mobile/tickets-app/__mocks__/react-native-animated-props.js` — patch AnimatedProps.\_\_makeNative
- `apps/mobile/tickets-app/__mocks__/renderer-proxy.js` — stub RendererProxy
- `apps/mobile/tickets-app/src/test-utils.tsx` — custom render with NavigationContainer + PaperProvider + SafeAreaProvider
- `apps/mobile/tickets-app/package.json` — add `test` script + 2 devDependencies

### @ds/mobile (edits only)

- `packages/design-system/mobile/jest.config.js` — change `testMatch` to `**/*.test.{ts,tsx}`
- `packages/design-system/mobile/src/test-utils.tsx` — moved from `__tests__/test-utils.tsx` (update one import)
- `packages/design-system/mobile/src/components/*/ComponentName.test.tsx` × 12 — moved from `__tests__/`, two imports updated each

### Monorepo

- `turbo.json` — add `test` task

---

## Task 1: Add Jest dependencies to tickets-app

**Files:**

- Modify: `apps/mobile/tickets-app/package.json`

- [ ] **Step 1: Edit package.json**

Add `"test": "jest"` to scripts and the two devDependencies:

```json
{
  "name": "@app/tickets",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "test": "jest",
    "start": "npx expo start --clear",
    "android": "npx expo start --android",
    "ios": "npx expo start --ios",
    "web": "npx expo start --web"
  },
  "devDependencies": {
    "@testing-library/react-native": "^12",
    "@types/react": "~19.1.0",
    "react-test-renderer": "^19",
    "typescript": "~5.9.2"
  }
}
```

- [ ] **Step 2: Install**

```bash
yarn install
```

Expected: lockfile updated, `@testing-library/react-native` and `react-test-renderer` appear in `node_modules`.

---

## Task 2: Create **mocks** directory

**Files:**

- Create: `apps/mobile/tickets-app/__mocks__/react-native-safe-area-context.js`
- Create: `apps/mobile/tickets-app/__mocks__/react-native-animated.js`
- Create: `apps/mobile/tickets-app/__mocks__/react-native-animated-props.js`
- Create: `apps/mobile/tickets-app/__mocks__/renderer-proxy.js`

- [ ] **Step 1: Create `__mocks__/react-native-safe-area-context.js`**

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

- [ ] **Step 2: Create `__mocks__/react-native-animated.js`**

```js
'use strict';

// Routes Animated to AnimatedMock so useNativeDriver:true doesn't trigger
// the native renderer version check.
module.exports = require('react-native/Libraries/Animated/AnimatedMock');
```

- [ ] **Step 3: Create `__mocks__/react-native-animated-props.js`**

```js
'use strict';

const AnimatedProps = jest.requireActual('react-native/Libraries/Animated/nodes/AnimatedProps');

const OriginalAnimatedProps = AnimatedProps.default ?? AnimatedProps;

if (OriginalAnimatedProps && OriginalAnimatedProps.prototype) {
  OriginalAnimatedProps.prototype.__makeNative = function () {};
}

module.exports = AnimatedProps;
```

- [ ] **Step 4: Create `__mocks__/renderer-proxy.js`**

```js
'use strict';

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

---

## Task 3: Create Jest setup files

**Files:**

- Create: `apps/mobile/tickets-app/jest.setup.js`
- Create: `apps/mobile/tickets-app/jest.setup-after-env.js`

- [ ] **Step 1: Create `jest.setup.js`**

```js
// Suppress RN internal warnings in test output
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
```

- [ ] **Step 2: Create `jest.setup-after-env.js`**

```js
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

---

## Task 4: Create jest.config.js

**Files:**

- Create: `apps/mobile/tickets-app/jest.config.js`

- [ ] **Step 1: Create `jest.config.js`**

```js
const path = require('path');

// Route all react imports to the single React bundled inside react-test-renderer
// to avoid "invalid hook call" errors from multiple React instances.
const sharedReact = path.resolve(
  __dirname,
  '../../../node_modules/react-test-renderer/node_modules/react',
);

/** @type {import('jest').Config} */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      {
        configFile: false,
        presets: ['babel-preset-expo'],
      },
    ],
  },
  // Transform RN, navigation, and expo packages (they ship JSX/Flow/TS source)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-safe-area-context|react-native-screens|react-native-svg|@react-navigation|expo|expo-status-bar|@expo)/)',
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

---

## Task 5: Create src/test-utils.tsx

**Files:**

- Create: `apps/mobile/tickets-app/src/test-utils.tsx`

- [ ] **Step 1: Create `src/test-utils.tsx`**

```tsx
import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AllProviders({ children }: { children: ReactElement }) {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <PaperProvider>{children}</PaperProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders as React.ComponentType, ...options });
}

export { customRender as render };
export * from '@testing-library/react-native';
```

---

## Task 6: Verify tickets-app tests run

- [ ] **Step 1: Run tests from repo root**

```bash
yarn workspace @app/tickets test
```

Expected output (abridged):

```
Test Suites: ~20 passed
Tests:       ~60 todo, 0 failed
Snapshots:   0 total
```

All tests should appear as `todo` — no failures. If any test suite errors with a module resolution error, check that the `transformIgnorePatterns` covers the failing module.

- [ ] **Step 2: Commit**

```bash
git add apps/mobile/tickets-app/jest.config.js \
        apps/mobile/tickets-app/jest.setup.js \
        apps/mobile/tickets-app/jest.setup-after-env.js \
        apps/mobile/tickets-app/__mocks__/ \
        apps/mobile/tickets-app/src/test-utils.tsx \
        apps/mobile/tickets-app/package.json \
        yarn.lock
git commit -m "feat(tickets-app): configura ambiente Jest com React Native"
```

---

## Task 7: Move @ds/mobile test-utils to src/

**Files:**

- Create: `packages/design-system/mobile/src/test-utils.tsx` (moved + edited)
- Delete: `packages/design-system/mobile/__tests__/test-utils.tsx`

- [ ] **Step 1: Create `src/test-utils.tsx`** with updated import (`'../src/theme'` → `'./theme'`):

```tsx
import React from 'react';
import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme';

function AllProviders({ children }: { children: ReactElement }) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders as React.ComponentType, ...options });
}

export { customRender as render };
export * from '@testing-library/react-native';
```

- [ ] **Step 2: Delete old file**

```bash
rm packages/design-system/mobile/__tests__/test-utils.tsx
```

---

## Task 8: Move @ds/mobile tests to co-located folders

**Files:** 12 test files. Pattern for each:

- From: `packages/design-system/mobile/__tests__/ComponentName.test.tsx`
- To: `packages/design-system/mobile/src/components/ComponentName/ComponentName.test.tsx`
- Import `from './test-utils'` → `from '../../test-utils'`
- Import `from '../src/components/ComponentName'` → `from './ComponentName'`

Components to migrate (all follow the identical pattern above):
`AppBar`, `Button`, `Card`, `Checkbox`, `Dialog`, `FAB`, `Input`, `LoadingIndicator`, `Menu`, `Radio`, `Select`, `Snackbar`

- [ ] **Step 1: Move and patch each of the 12 test files**

For each `ComponentName` in the list above, run:

```bash
# Example shown for Button — repeat for all 12
mv packages/design-system/mobile/__tests__/Button.test.tsx \
   packages/design-system/mobile/src/components/Button/Button.test.tsx
```

Then edit each moved file to update the two imports. **Before:**

```tsx
import { render, screen, fireEvent } from './test-utils';
import { Button } from '../src/components/Button';
```

**After:**

```tsx
import { render, screen, fireEvent } from '../../test-utils';
import { Button } from './Button';
```

The only part that changes per file is the component name. The import pattern is identical for all 12.

- [ ] **Step 2: Delete the now-empty `__tests__/` directory**

```bash
rmdir packages/design-system/mobile/__tests__/
```

---

## Task 9: Update @ds/mobile jest.config.js testMatch

**Files:**

- Modify: `packages/design-system/mobile/jest.config.js`

- [ ] **Step 1: Change `testMatch`**

Change the single `testMatch` line from:

```js
testMatch: ['**/__tests__/**/*.test.{js,ts,tsx}'],
```

to:

```js
testMatch: ['**/*.test.{ts,tsx}'],
```

No other changes to the file.

- [ ] **Step 2: Run @ds/mobile tests to verify all 12 still pass**

```bash
yarn workspace @ds/mobile test
```

Expected:

```
Test Suites: 12 passed, 12 total
Tests:       XX passed, 0 failed
```

All previously-passing tests must continue to pass. If any test fails with a module-not-found error, verify the import was updated to use `'../../test-utils'` and `'./ComponentName'`.

- [ ] **Step 3: Commit**

```bash
git add packages/design-system/mobile/jest.config.js \
        packages/design-system/mobile/src/test-utils.tsx \
        packages/design-system/mobile/src/components/
git rm packages/design-system/mobile/__tests__/test-utils.tsx \
       packages/design-system/mobile/__tests__/AppBar.test.tsx \
       packages/design-system/mobile/__tests__/Button.test.tsx \
       packages/design-system/mobile/__tests__/Card.test.tsx \
       packages/design-system/mobile/__tests__/Checkbox.test.tsx \
       packages/design-system/mobile/__tests__/Dialog.test.tsx \
       packages/design-system/mobile/__tests__/FAB.test.tsx \
       packages/design-system/mobile/__tests__/Input.test.tsx \
       packages/design-system/mobile/__tests__/LoadingIndicator.test.tsx \
       packages/design-system/mobile/__tests__/Menu.test.tsx \
       packages/design-system/mobile/__tests__/Radio.test.tsx \
       packages/design-system/mobile/__tests__/Select.test.tsx \
       packages/design-system/mobile/__tests__/Snackbar.test.tsx
git commit -m "refactor(@ds/mobile): migra testes para estrutura co-localizada"
```

---

## Task 10: Add test task to turbo.json + final verification

**Files:**

- Modify: `turbo.json`

- [ ] **Step 1: Add `test` task to turbo.json**

Add the `test` task inside the `tasks` object (after `check-types`):

```json
"test": {
  "dependsOn": ["^build"]
}
```

Full `turbo.json` after change:

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "storybook": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "outputs": ["storybook-static/**"]
    }
  }
}
```

- [ ] **Step 2: Add `test` script to root package.json**

Add `"test": "turbo run test"` to root `package.json` scripts (alongside `lint`, `check-types`):

```json
"scripts": {
  "build": "turbo run build",
  "dev": "turbo run dev",
  "lint": "turbo run lint",
  "format": "prettier --write \"**/*.{ts,tsx,js,mjs,cjs,json,md,css}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,mjs,cjs,json,md,css}\"",
  "check-types": "turbo run check-types",
  "test": "turbo run test",
  "prepare": "husky",
  "changeset": "changeset",
  "version-packages": "changeset version"
}
```

- [ ] **Step 3: Run full test pipeline from repo root**

```bash
yarn test
```

Expected output (all three workspaces with a `test` script):

```
@app/tickets:test: Test Suites: ~20 passed
@ds/mobile:test:  Test Suites: 12 passed
todo-app:test:    Test Suites: X passed
```

- [ ] **Step 4: Commit**

```bash
git add turbo.json package.json
git commit -m "feat(monorepo): adiciona task test ao pipeline turbo"
```

---

## Verification Summary

| Command                            | Expected result                  |
| ---------------------------------- | -------------------------------- |
| `yarn workspace @app/tickets test` | ~20 suites, ~60 todo, 0 failures |
| `yarn workspace @ds/mobile test`   | 12 suites, all passing           |
| `yarn test` (root)                 | All 3 workspaces pass            |
| `yarn check-types` (root)          | 0 errors                         |
