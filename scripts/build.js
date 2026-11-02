import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
const sourceDir = new URL('../src/', import.meta.url);
for (const name of await readdir(sourceDir)) {
  if (!name.endsWith('.ts')) continue;
  const source = await readFile(new URL(name, sourceDir), 'utf8');
  const output = stripTypeScriptTypes(source);
  await writeFile(new URL(`../dist/${name.replace(/\.ts$/, '.js')}`, import.meta.url), output,
    { mode: name === 'cli.ts' ? 0o755 : 0o644 });
}
