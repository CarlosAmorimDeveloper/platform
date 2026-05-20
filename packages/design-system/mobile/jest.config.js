/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.{js,ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      {
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },
  // Transform react-native and Paper source (they ship as JSX/TS)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
