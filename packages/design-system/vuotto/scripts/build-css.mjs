import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

mkdirSync(join(distDir, 'tokens'), { recursive: true });
mkdirSync(join(distDir, 'assets', 'fonts'), { recursive: true });

// Token files ship individually too (package.json `./tokens/*` export) —
// their `../assets/fonts/...` references stay correct because dist/tokens/
// mirrors src/tokens/ one level above dist/assets/fonts/, same as in src/.
for (const file of readdirSync(join(srcDir, 'tokens'))) {
  cpSync(join(srcDir, 'tokens', file), join(distDir, 'tokens', file));
}

cpSync(join(srcDir, 'assets', 'fonts'), join(distDir, 'assets', 'fonts'), { recursive: true });

// Flattened entry point (`./styles.css` export): resolve the `@import`
// chain in src/styles.css into one file. It lands at dist root, one level
// above dist/tokens/, so any `../assets/fonts/...` reference inlined from a
// token file has to become `./assets/fonts/...` to still point at
// dist/assets/fonts/ from the new location.
const entry = readFileSync(join(srcDir, 'styles.css'), 'utf8');
const importPattern = /@import\s+"tokens\/([^"]+)";/g;
let flattened = '';
let match;
while ((match = importPattern.exec(entry))) {
  const tokenFile = readFileSync(join(srcDir, 'tokens', match[1]), 'utf8');
  flattened += tokenFile.replaceAll('../assets/fonts/', './assets/fonts/') + '\n';
}

writeFileSync(join(distDir, 'styles.css'), flattened);
