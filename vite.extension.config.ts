import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Chrome extension build. Shares all app source with the website build;
 * only the entry point, fonts, and empty state differ (see src/extension).
 *
 * Output (dist-extension/):
 *   manifest.json            – from extension/manifest.json, version synced to package.json
 *   background.js            – service worker (context menu + toolbar action)
 *   extension/editor.html    – the editor page, opened in a full tab
 *   assets/, icons/, favicon – bundled app, extension icons, favicon
 *
 * public/ is NOT copied: it holds website-only files (OG image, sitemap,
 * Lottie marketing icons). The extension's empty state doesn't use them.
 */

const root = __dirname;
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as { version: string };

function extensionManifest(): Plugin {
  return {
    name: 'webimg-extension-manifest',
    generateBundle() {
      const manifest = JSON.parse(
        readFileSync(resolve(root, 'extension/manifest.json'), 'utf8')
      ) as Record<string, unknown>;
      manifest.version = pkg.version;
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(manifest, null, 2) + '\n',
      });
      this.emitFile({
        type: 'asset',
        fileName: 'favicon.svg',
        source: readFileSync(resolve(root, 'public/favicon.svg')),
      });
      for (const size of [16, 32, 48, 128]) {
        this.emitFile({
          type: 'asset',
          fileName: `icons/icon-${size}.png`,
          source: readFileSync(resolve(root, `extension/icons/icon-${size}.png`)),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), extensionManifest()],
  publicDir: false,
  build: {
    outDir: 'dist-extension',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        editor: resolve(root, 'extension/editor.html'),
        background: resolve(root, 'extension/background.ts'),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',
      },
    },
  },
});
