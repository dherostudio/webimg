import type { BgColor, CropRect, FitMode, OutputFormat, Rotation } from '../types';
import { bgColorValue, computeFit } from './fit';
import { buildOrientedSource } from './orient';

interface ExportOptions {
  source: HTMLImageElement;
  crop: CropRect;
  outputWidth: number;
  outputHeight: number;
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  format: OutputFormat;
  quality: number;
  fit: FitMode;
  bg: BgColor;
}

export interface ExportResult {
  blob: Blob;
  format: OutputFormat;
  fellBack: boolean;
}

async function encode(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
): Promise<{ blob: Blob; usedFormat: OutputFormat; fellBack: boolean }> {
  const mime = `image/${format}`;
  const q = quality / 100;

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), mime, q);
  });

  if (blob && blob.type === mime) {
    return { blob, usedFormat: format, fellBack: false };
  }

  if (format === 'avif') {
    const webp = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/webp', q);
    });
    if (webp) {
      return { blob: webp, usedFormat: 'webp', fellBack: true };
    }
  }

  throw new Error(`Failed to encode image as ${format}`);
}

export async function exportImage(opts: ExportOptions): Promise<ExportResult> {
  const oriented = buildOrientedSource(opts.source, opts.rotation, opts.flipH, opts.flipV);

  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(opts.outputWidth));
  out.height = Math.max(1, Math.round(opts.outputHeight));
  const ctx = out.getContext('2d')!;

  // Fill background (covers the whole output canvas — letterboxing visible after image draw)
  const bg = bgColorValue(opts.bg, opts.format);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, out.width, out.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const fit = computeFit(opts.crop.w, opts.crop.h, out.width, out.height, opts.fit);

  // For cover mode, clip to the output box so overflow doesn't bleed (it already
  // can't, since the canvas itself is the bounds — but explicit save/restore here
  // keeps semantics clean if we ever inset).
  ctx.drawImage(
    oriented,
    opts.crop.x,
    opts.crop.y,
    opts.crop.w,
    opts.crop.h,
    fit.dx,
    fit.dy,
    fit.dw,
    fit.dh
  );

  const q = opts.format === 'png' ? 100 : opts.quality;
  const { blob, usedFormat, fellBack } = await encode(out, opts.format, q);

  return { blob, format: usedFormat, fellBack };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
