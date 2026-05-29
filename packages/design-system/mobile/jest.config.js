const path = require('path');

// All react imports must resolve to a single instance to avoid "invalid hook
// call" errors in tests. Point directly to the workspace root react.
const sharedReact = path.resolve(__dirname, '../../../node_modules/react');

/** @type {import('jest').Config} */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      {
        configFile: false,
        presets: ['@react-native/babel-preset'],
      },
    ],
  },
  // Transform react-native and Paper source (they ship as JSX/TS/Flow)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    // Deduplicate React — react-native bundles its own, which conflicts with
    // react-test-renderer's bundled React. All code must share one instance.
    '^react$': sharedReact,
    '^react/(.*)$': `${sharedReact}/$1`,
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
    // Use AnimatedMock to avoid useNativeDriver triggering the native renderer
    // version check (react-native bundles renderer 19.2.3 but workspace has
    // react 19.2.6, which causes an incompatible-versions throw).
    '^react-native/Libraries/Animated/Animated$': '<rootDir>/__mocks__/react-native-animated.js',
    '^react-native/Libraries/Animated/nodes/AnimatedProps$':
      '<rootDir>/__mocks__/react-native-animated-props.js',
    // Override RendererProxy to avoid loading the pre-built ReactNativeRenderer-dev
    // which has a hard version check incompatible with the workspace React version.
    '^react-native/Libraries/ReactNative/RendererProxy$': '<rootDir>/__mocks__/renderer-proxy.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
};
