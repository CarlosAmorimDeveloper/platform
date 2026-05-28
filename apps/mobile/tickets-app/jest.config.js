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
