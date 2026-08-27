import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'native/index': 'src/native/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
});
