// Rasterizes public/og-image.svg to public/og-image.png (1200x630).
// Run with: npm run gen:og
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(`${root}public/og-image.svg`, 'utf8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true },
});

writeFileSync(`${root}public/og-image.png`, resvg.render().asPng());
console.log('Wrote public/og-image.png');
