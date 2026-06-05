# webimg

webimg is a free, browser-based image editor. Crop, resize, rotate, convert between formats, and compress images, all entirely on your device.

Try it: https://webimg.app

## Privacy

webimg does not send your images to a server. There is no server.

Every crop, resize, rotation, conversion, and compression runs locally in your browser using the Canvas API. Your images never leave your device. webimg uses no analytics, no cookies, and no tracking of any kind.

## Features

- **Crop & straighten** — crop to any aspect ratio with rule-of-thirds guides, rotate in 90° steps, flip horizontally or vertically
- **Resize** — set exact pixel dimensions with an optional aspect-ratio lock
- **Convert** — export to WebP, AVIF, PNG, or JPEG (AVIF falls back to WebP where unsupported)
- **Compress** — quality slider with a live file-size estimate
- **Batch processing** — edit multiple images at once and export them as a single ZIP, each with its own filename
- **Light & dark themes**

Supported input formats: JPEG, PNG, WebP, AVIF, GIF, BMP.

## Developing

Requires Node.js 18 or newer.

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Building

Type-check and build to `dist/`:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Generating the social image

The Open Graph image (`public/og-image.png`) is rasterized from `public/og-image.svg`. After editing the SVG, regenerate the PNG with:

```sh
npm run gen:og
```

## Tech stack

- [React 18](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for bundling and the dev server
- HTML Canvas API for all image processing
- [JSZip](https://stuk.github.io/jszip/) for batch ZIP export
- [@resvg/resvg-js](https://github.com/yisibl/resvg-js) for social-image generation

## Contributing

Issues and pull requests are welcome at https://github.com/dherostudio/webimg.

## License

The webimg source code is released under the [MIT License](LICENSE) © dhero.studio.

### Credits & licensing of third-party assets

The MIT license covers webimg's own source code only. It does **not** cover the
following third-party assets, which are licensed separately and are **not**
redistributable under MIT:

- **Animated icons** (`public/icons/*.json`) — Lottie animations from
  [Flaticon](https://www.flaticon.com/), used under a Flaticon license. They
  remain the property of Flaticon and its authors. Do not reuse, redistribute,
  or extract these files outside this project; obtain your own license from
  Flaticon if you need them.

Fonts are loaded at runtime from Google Fonts and are not bundled in this
repository: [Manrope](https://github.com/sharanda/manrope) and
[JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), both under the
[SIL Open Font License 1.1](https://openfontlicense.org/).
