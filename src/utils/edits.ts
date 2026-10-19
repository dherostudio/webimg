import type { CropFrac, CropRect, ItemEdits, Rotation } from '../types';
import { FULL_FRAC, rectToFrac } from './cropFrac';

interface Dims {
  w: number;
  h: number;
}

/** Post-rotation bounds for a source of natural size `natural`. */
export function rotatedDims(natural: Dims, rotation: Rotation): Dims {
  const swapped = rotation === 90 || rotation === 270;
  return swapped ? { w: natural.h, h: natural.w } : { w: natural.w, h: natural.h };
}

/** Fresh edits for a newly imported image: full crop, native size, no transform. */
export function initialEdits(natural: Dims): ItemEdits {
  return {
    cropFrac: FULL_FRAC,
    rotation: 0,
    flipH: false,
    flipV: false,
    outputWidth: natural.w,
    outputHeight: natural.h,
  };
}

/** Rotating resets the crop and output size to the new oriented bounds; flips are kept. */
export function rotateEdits(edits: ItemEdits, natural: Dims, rotation: Rotation): ItemEdits {
  const d = rotatedDims(natural, rotation);
  return { ...edits, rotation, cropFrac: FULL_FRAC, outputWidth: d.w, outputHeight: d.h };
}

/** Reset crop to the full image and output size to the oriented native size. */
export function resetCropEdits(edits: ItemEdits, natural: Dims): ItemEdits {
  const d = rotatedDims(natural, edits.rotation);
  return { ...edits, cropFrac: FULL_FRAC, outputWidth: d.w, outputHeight: d.h };
}

/**
 * Apply a new pixel crop. With the aspect lock on, the output height follows
 * the crop's aspect ratio while the output width stays put.
 */
export function cropEdits(
  edits: ItemEdits,
  natural: Dims,
  rect: CropRect,
  aspectLocked: boolean
): ItemEdits {
  const d = rotatedDims(natural, edits.rotation);
  if (d.w === 0 || d.h === 0) return edits;
  const cropFrac: CropFrac = rectToFrac(rect, d.w, d.h);
  if (aspectLocked && edits.outputWidth > 0 && rect.w > 0 && rect.h > 0) {
    const outputHeight = Math.max(1, Math.round(edits.outputWidth / (rect.w / rect.h)));
    return { ...edits, cropFrac, outputHeight };
  }
  return { ...edits, cropFrac };
}

/** Set output width; with the aspect lock on, height follows `aspect` (w / h). */
export function widthEdits(
  edits: ItemEdits,
  w: number,
  aspectLocked: boolean,
  aspect: number
): ItemEdits {
  if (aspectLocked && aspect > 0) {
    return { ...edits, outputWidth: w, outputHeight: Math.max(1, Math.round(w / aspect)) };
  }
  return { ...edits, outputWidth: w };
}

/** Set output height; with the aspect lock on, width follows `aspect` (w / h). */
export function heightEdits(
  edits: ItemEdits,
  h: number,
  aspectLocked: boolean,
  aspect: number
): ItemEdits {
  if (aspectLocked && aspect > 0) {
    return { ...edits, outputHeight: h, outputWidth: Math.max(1, Math.round(h * aspect)) };
  }
  return { ...edits, outputHeight: h };
}

/** Return `name`, or `base-2.ext`, `base-3.ext`… if already in `used`. Adds the result to `used`. */
export function uniqueName(name: string, used: Set<string>): string {
  let out = name;
  if (used.has(out)) {
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    let n = 2;
    while (used.has(`${base}-${n}${ext}`)) n++;
    out = `${base}-${n}${ext}`;
  }
  used.add(out);
  return out;
}
