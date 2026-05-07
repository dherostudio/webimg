import type { Rotation } from '../types';

/**
 * Returns a canvas containing the source after rotation + flip are applied.
 * The canvas dimensions match the post-rotation natural size of the source.
 */
export function buildOrientedSource(
  source: HTMLImageElement,
  rotation: Rotation,
  flipH: boolean,
  flipV: boolean
): HTMLCanvasElement {
  const sw = source.naturalWidth;
  const sh = source.naturalHeight;
  const swapped = rotation === 90 || rotation === 270;
  const cw = swapped ? sh : sw;
  const ch = swapped ? sw : sh;

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d')!;

  ctx.save();
  ctx.translate(cw / 2, ch / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(source, -sw / 2, -sh / 2);
  ctx.restore();

  return canvas;
}
