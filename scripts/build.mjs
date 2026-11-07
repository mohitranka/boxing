import { build } from 'esbuild';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('../dist/', import.meta.url);
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const common = { bundle: true, minify: true, legalComments: 'none', target: 'es2020', logLevel: 'warning' };
await build({ ...common, entryPoints: [new URL('src/main.js', root).pathname], outfile: new URL('app.js', dist).pathname, format: 'esm', external: ['three', 'three/addons/*'] });
await build({ ...common, entryPoints: [new URL('src/input/detector-worker.js', root).pathname], outfile: new URL('detector-worker.js', dist).pathname, format: 'iife' });
await build({ ...common, entryPoints: [new URL('src/input/mp-constants.js', root).pathname], outfile: new URL('mp-constants.js', dist).pathname, format: 'esm' });

await cp(new URL('styles.css', root), new URL('styles.css', dist));
const html = await readFile(new URL('index.html', root), 'utf8');
await writeFile(new URL('index.html', dist), html.replace('./src/main.js', './app.js'));
console.log('built dist/');
