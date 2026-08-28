import { nextJsConfig } from '@repo/eslint-config/next-js';
import { noCrossGenerationImports } from '@repo/eslint-config/architecture-boundaries';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextJsConfig,
  ...noCrossGenerationImports('@vuotto'),
  globalIgnores(['jest.config.js', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
