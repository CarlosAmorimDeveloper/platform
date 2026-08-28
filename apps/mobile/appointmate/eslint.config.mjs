import { config } from '@repo/eslint-config/react-internal';
import {
  domainServicesBoundaries,
  noCrossGenerationImports,
} from '@repo/eslint-config/architecture-boundaries';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  ...config,
  // Order matters: domainServicesBoundaries must come after
  // noCrossGenerationImports so its more specific (files-scoped) rule wins
  // for domain/services files instead of being silently overwritten by the
  // unscoped one — see the comment on domainServicesBoundaries.
  ...noCrossGenerationImports('@vuotto'),
  ...domainServicesBoundaries('src', '@vuotto'),
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
