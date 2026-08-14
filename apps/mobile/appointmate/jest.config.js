const path = require('path');

// Route all react imports to the single React installed in this app's node_modules
// to avoid "invalid hook call" errors from multiple React instances.
const sharedReact = path.resolve(__dirname, 'node_modules/react');
// Same problem, different symptom: @ds/mobile and this app can each resolve a
// different physical copy of react-native-paper (one hoisted to the repo
// root, one local to this app per metro.config.js's resolver). Portal-based
// components (Dialog, Menu) rely on React Context to find their PortalHost —
// two module instances mean two different Context objects, so Portal content
// silently can't see the Provider and the whole render tree crashes with an
// opaque "window.dispatchEvent is not a function" (React failing to report
// the real error in this non-browser env). Inline/non-Portal components
// (Chip, Button, Snackbar, AppBar) never hit this because they don't need a
// shared Context instance to render.
const sharedReactNativePaper = path.resolve(__dirname, 'node_modules/react-native-paper');

/** @type {import('jest').Config} */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/*.test.{ts,tsx}'],
  // firestore.rules.test.ts needs the Firestore emulator running (see
  // "test:rules" script) — excluded from the plain `test` run so `yarn test`
  // doesn't fail with ECONNREFUSED when no emulator is up.
  testPathIgnorePatterns: ['/node_modules/', 'firestore\\.rules\\.test'],
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
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-reanimated|react-native-worklets|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-chart-kit|@react-navigation|expo|expo-status-bar|@expo|firebase)/)',
  ],
  moduleNameMapper: {
    '^react$': sharedReact,
    '^react/(.*)$': `${sharedReact}/$1`,
    '^react-native-paper$': sharedReactNativePaper,
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.js',
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
    '^react-native/Libraries/Animated/Animated$': '<rootDir>/__mocks__/react-native-animated.js',
    '^react-native/Libraries/Animated/nodes/AnimatedProps$':
      '<rootDir>/__mocks__/react-native-animated-props.js',
    '^react-native/Libraries/ReactNative/RendererProxy$': '<rootDir>/__mocks__/renderer-proxy.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};
