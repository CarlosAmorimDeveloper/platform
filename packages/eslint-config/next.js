import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';
import { config as reactInternalConfig } from './react-internal.js';

/** @type {import("eslint").Linter.Config[]} */
export const nextJsConfig = [
  ...reactInternalConfig,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
];
