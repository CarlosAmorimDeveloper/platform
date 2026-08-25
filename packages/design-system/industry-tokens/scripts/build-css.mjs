import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');
const distDir = join(root, 'dist');

mkdirSync(join(distDir, 'tokens'), { recursive: true });

for (const file of readdirSync(join(srcDir, 'tokens'))) {
  cpSync(join(srcDir, 'tokens', file), join(distDir, 'tokens', file));
}

const entry = readFileSync(join(srcDir, 'styles.css'), 'utf8');
const importPattern = /@import\s+['"]tokens\/([^'"]+)['"];/g;
let flattened = '';
let match;
while ((match = importPattern.exec(entry))) {
  flattened += readFileSync(join(srcDir, 'tokens', match[1]), 'utf8') + '\n';
}

writeFileSync(join(distDir, 'styles.css'), flattened);
