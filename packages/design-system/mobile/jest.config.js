const path = require('path');

// All react imports must resolve to a single instance (the one bundled with
// react-test-renderer) to avoid "invalid hook call" errors in tests.
const sharedReact = path.resolve(
  __dirname,
  '../../../node_modules/react-test-renderer/node_modules/react',
);

/** @type {import('jest').Config} */
module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/__tests__/**/*.test.{js,ts,tsx}'],
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
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
