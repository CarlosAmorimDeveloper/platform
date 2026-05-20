import { config } from '@repo/eslint-config/base';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  ...config,
  {
    ignores: ['*.config.js', 'tailwind-utils.js'],
  },
  {
    files: ['__mocks__/**/*.js', '__tests__/**/*.js', 'jest.setup*.js'],
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
]);
