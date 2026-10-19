import { describe, expect, it } from 'vitest';
import type { ItemEdits } from '../types';
import { FULL_FRAC } from './cropFrac';
import {
  cropEdits,
  heightEdits,
  initialEdits,
  resetCropEdits,
  rotatedDims,
  rotateEdits,
  uniqueName,
  widthEdits,
} from './edits';

const landscape = { w: 4000, h: 3000 };

describe('rotatedDims', () => {
  it('keeps bounds at 0° and 180°', () => {
    expect(rotatedDims(landscape, 0)).toEqual({ w: 4000, h: 3000 });
    expect(rotatedDims(landscape, 180)).toEqual({ w: 4000, h: 3000 });
  });
  it('swaps bounds at 90° and 270°', () => {
    expect(rotatedDims(landscape, 90)).toEqual({ w: 3000, h: 4000 });
    expect(rotatedDims(landscape, 270)).toEqual({ w: 3000, h: 4000 });
  });
});

describe('initialEdits', () => {
  it('uses the full image at native size with no transform', () => {
    expect(initialEdits(landscape)).toEqual({
      cropFrac: FULL_FRAC,
      rotation: 0,
      flipH: false,
      flipV: false,
      outputWidth: 4000,
      outputHeight: 3000,
    });
  });

  it('gives each image its own native size', () => {
    expect(initialEdits({ w: 1080, h: 1920 })).toMatchObject({
      outputWidth: 1080,
      outputHeight: 1920,
    });
  });
});

describe('rotateEdits', () => {
  it('resets crop and swaps output size, keeping flips', () => {
    const start: ItemEdits = {
      ...initialEdits(landscape),
      flipH: true,
      cropFrac: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 },
      outputWidth: 800,
      outputHeight: 600,
    };
    expect(rotateEdits(start, landscape, 90)).toEqual({
      ...start,
      rotation: 90,
      cropFrac: FULL_FRAC,
      outputWidth: 3000,
      outputHeight: 4000,
    });
  });
});

describe('resetCropEdits', () => {
  it('restores the full crop at the rotated native size', () => {
    const start: ItemEdits = {
      ...initialEdits(landscape),
      rotation: 270,
      cropFrac: { x: 0.2, y: 0, w: 0.3, h: 1 },
      outputWidth: 10,
      outputHeight: 10,
    };
    expect(resetCropEdits(start, landscape)).toMatchObject({
      cropFrac: FULL_FRAC,
      outputWidth: 3000,
      outputHeight: 4000,
      rotation: 270,
    });
  });
});

describe('cropEdits', () => {
  const start = initialEdits(landscape);

  it('stores the crop as fractions of the oriented image', () => {
    const next = cropEdits(start, landscape, { x: 1000, y: 750, w: 2000, h: 1500 }, false);
    expect(next.cropFrac).toEqual({ x: 0.25, y: 0.25, w: 0.5, h: 0.5 });
    expect(next.outputHeight).toBe(3000);
  });

  it('uses rotated bounds for the fractions', () => {
    const rotated = rotateEdits(start, landscape, 90); // 3000×4000
    const next = cropEdits(rotated, landscape, { x: 0, y: 0, w: 1500, h: 1000 }, false);
    expect(next.cropFrac).toEqual({ x: 0, y: 0, w: 0.5, h: 0.25 });
  });

  it('follows the crop aspect on height when locked', () => {
    const next = cropEdits(start, landscape, { x: 0, y: 0, w: 2000, h: 2000 }, true);
    expect(next.outputWidth).toBe(4000);
    expect(next.outputHeight).toBe(4000);
  });

  it('is a no-op for a zero-size image', () => {
    const empty = initialEdits({ w: 0, h: 0 });
    expect(cropEdits(empty, { w: 0, h: 0 }, { x: 0, y: 0, w: 1, h: 1 }, true)).toBe(empty);
  });
});

describe('widthEdits / heightEdits', () => {
  const start = initialEdits(landscape);

  it('keeps aspect when locked', () => {
    expect(widthEdits(start, 800, true, 4 / 3)).toMatchObject({ outputWidth: 800, outputHeight: 600 });
    expect(heightEdits(start, 600, true, 4 / 3)).toMatchObject({ outputWidth: 800, outputHeight: 600 });
  });

  it('changes one side only when unlocked', () => {
    expect(widthEdits(start, 800, false, 4 / 3)).toMatchObject({ outputWidth: 800, outputHeight: 3000 });
    expect(heightEdits(start, 600, false, 4 / 3)).toMatchObject({ outputWidth: 4000, outputHeight: 600 });
  });

  it('never rounds the other side down to zero', () => {
    expect(widthEdits(start, 1, true, 100).outputHeight).toBe(1);
    expect(heightEdits(start, 1, true, 0.001).outputWidth).toBe(1);
  });
});

describe('uniqueName', () => {
  it('numbers duplicates from 2', () => {
    const used = new Set<string>();
    expect(uniqueName('photo.webp', used)).toBe('photo.webp');
    expect(uniqueName('photo.webp', used)).toBe('photo-2.webp');
    expect(uniqueName('photo.webp', used)).toBe('photo-3.webp');
  });

  it('skips numbers already taken', () => {
    const used = new Set(['a.png', 'a-2.png']);
    expect(uniqueName('a.png', used)).toBe('a-3.png');
  });

  it('handles names without an extension', () => {
    const used = new Set(['readme']);
    expect(uniqueName('readme', used)).toBe('readme-2');
  });
});
