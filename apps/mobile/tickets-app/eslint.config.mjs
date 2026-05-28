import { config } from '@repo/eslint-config/base';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  ...config,
  {
    ignores: ['node_modules/**', 'android/**', 'ios/**', '.expo/**'],
  },
  {
    files: [
      '**/__mocks__/**/*.js',
      'jest.setup*.js',
      'jest.config.js',
      'babel.config.js',
      'metro.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
]);
