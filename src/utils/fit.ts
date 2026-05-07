import type { BgColor, FitMode } from '../types';

export interface FitRect {
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

/**
 * Compute the destination rectangle inside an output box for a given crop,
 * respecting the chosen fit mode.
 */
export function computeFit(
  cropW: number,
  cropH: number,
  outW: number,
  outH: number,
  mode: FitMode
): FitRect {
  if (mode === 'stretch' || cropW <= 0 || cropH <= 0) {
    return { dx: 0, dy: 0, dw: outW, dh: outH };
  }
  const cropAspect = cropW / cropH;
  const outAspect = outW / outH;

  if (mode === 'contain') {
    if (cropAspect > outAspect) {
      // crop wider than output → fit width, letterbox top/bottom
      const dh = outW / cropAspect;
      return { dx: 0, dy: (outH - dh) / 2, dw: outW, dh };
    }
    const dw = outH * cropAspect;
    return { dx: (outW - dw) / 2, dy: 0, dw, dh: outH };
  }

  // cover: fill the output box, overflow gets clipped
  if (cropAspect > outAspect) {
    const dw = outH * cropAspect;
    return { dx: (outW - dw) / 2, dy: 0, dw, dh: outH };
  }
  const dh = outW / cropAspect;
  return { dx: 0, dy: (outH - dh) / 2, dw: outW, dh };
}

export function bgColorValue(bg: BgColor, format: string): string | null {
  if (bg === 'transparent') {
    // JPEG has no alpha channel — fall back to white.
    return format === 'jpeg' ? '#ffffff' : null;
  }
  return bg;
}

/**
 * Draw a checkerboard pattern on a canvas context (for transparent backdrops in previews).
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cellSize = 8
): void {
  const a = '#1f1f23';
  const b = '#15151a';
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      ctx.fillStyle = ((x / cellSize + y / cellSize) % 2 === 0 ? a : b);
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}

export function drawCheckerboardThemed(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: 'light' | 'dark',
  cellSize = 8
): void {
  const a = theme === 'light' ? '#e4e4e7' : '#1f1f23';
  const b = theme === 'light' ? '#f0f0f2' : '#15151a';
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      ctx.fillStyle = (x / cellSize + y / cellSize) % 2 === 0 ? a : b;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
}
