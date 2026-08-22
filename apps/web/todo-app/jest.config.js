const path = require('path');

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    // lucide-react's "dynamic" entrypoint (@vuotto/web's Icon) ships a root
    // dynamic.js that is really `export * from './dynamic.mjs'` — ESM
    // syntax under a .js extension, which Jest's CJS loader can't parse
    // without a transform.
    '^.+\\.(js|mjs)$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  transformIgnorePatterns: ['node_modules/(?!(lucide-react)/)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react$': path.resolve(__dirname, '../../../node_modules/react'),
    '^react-dom$': path.resolve(__dirname, '../../../node_modules/react-dom'),
    '^react-dom/(.*)$': path.resolve(__dirname, '../../../node_modules/react-dom/$1'),
    '^react/(.*)$': path.resolve(__dirname, '../../../node_modules/react/$1'),
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

module.exports = config;
