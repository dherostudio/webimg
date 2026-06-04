// Rasterizes public/og-image.svg to public/og-image.png (1200x630).
// Run with: npm run gen:og
//
// The brand fonts (Manrope + JetBrains Mono) are loaded from their static TTFs
// shipped by the @expo-google-fonts/* dev dependencies, since resvg can't fetch
// Google Fonts. System fonts are disabled for deterministic output.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(`${root}public/og-image.svg`, 'utf8');

const fontFiles = [
  'node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf',
  'node_modules/@expo-google-fonts/manrope/500Medium/Manrope_500Medium.ttf',
  'node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf',
  'node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf',
  'node_modules/@expo-google-fonts/jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf',
].map((p) => `${root}${p}`);

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    fontFiles,
    loadSystemFonts: false,
    defaultFontFamily: 'Manrope',
    sansSerifFamily: 'Manrope',
    monospaceFamily: 'JetBrains Mono',
  },
});

writeFileSync(`${root}public/og-image.png`, resvg.render().asPng());
console.log('Wrote public/og-image.png');
