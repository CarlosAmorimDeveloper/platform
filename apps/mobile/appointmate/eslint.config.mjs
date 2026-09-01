import { config } from '@repo/eslint-config/react-internal';
import { domainServicesBoundaries } from '@repo/eslint-config/architecture-boundaries';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  ...config,
  ...domainServicesBoundaries('src'),
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
      'scripts/**/*.js',
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
    files: ['scripts/**/*.js'],
    rules: {
      'no-console': 'off',
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
