/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    // lucide-react's "dynamic" entrypoint (Icon.tsx) ships a root dynamic.js
    // that is really `export * from './dynamic.mjs'` — ESM syntax under a
    // .js extension, which Jest's CJS loader can't parse without a
    // transform (same workaround as apps/web/todo-app/jest.config.js).
    '^.+\\.(js|mjs)$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!(lucide-react)/)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.ts'],
  // lucide-react ships its own nested react copy in node_modules/lucide-react/node_modules
  // (version drift vs. the hoisted root copy). Without this, DynamicIcon renders against
  // a second React instance with a null hook dispatcher — force everything onto one copy.
  moduleNameMapper: {
    '^react$': require.resolve('react'),
    '^react-dom$': require.resolve('react-dom'),
  },
};
