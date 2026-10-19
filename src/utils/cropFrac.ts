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
