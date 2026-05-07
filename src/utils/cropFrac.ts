import type { CropFrac, CropRect } from '../types';

export const FULL_FRAC: CropFrac = { x: 0, y: 0, w: 1, h: 1 };

export function fracToRect(frac: CropFrac, imgW: number, imgH: number): CropRect {
  return {
    x: frac.x * imgW,
    y: frac.y * imgH,
    w: frac.w * imgW,
    h: frac.h * imgH,
  };
}

export function rectToFrac(rect: CropRect, imgW: number, imgH: number): CropFrac {
  if (imgW <= 0 || imgH <= 0) return FULL_FRAC;
  return {
    x: rect.x / imgW,
    y: rect.y / imgH,
    w: rect.w / imgW,
    h: rect.h / imgH,
  };
}

/** Get the post-rotation bounds of an image. */
export function orientedDims(
  source: HTMLImageElement,
  rotation: 0 | 90 | 180 | 270
): { w: number; h: number } {
  const swapped = rotation === 90 || rotation === 270;
  return {
    w: swapped ? source.naturalHeight : source.naturalWidth,
    h: swapped ? source.naturalWidth : source.naturalHeight,
  };
}
