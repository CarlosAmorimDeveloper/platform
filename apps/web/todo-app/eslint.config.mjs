import { nextJsConfig } from '@repo/eslint-config/next-js';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextJsConfig,
  globalIgnores(['jest.config.js', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
