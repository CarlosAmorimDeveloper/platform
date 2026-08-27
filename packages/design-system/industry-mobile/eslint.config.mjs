import { config } from '@repo/eslint-config/react-internal';
import { noCrossGenerationImports } from '@repo/eslint-config/architecture-boundaries';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  ...noCrossGenerationImports('@vuotto'),
  {
    ignores: ['*.config.js', 'storybook-static/**'],
  },
  {
    files: ['__mocks__/**/*.js', 'jest.setup*.js'],
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
];
