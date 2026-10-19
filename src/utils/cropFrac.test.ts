import { describe, expect, it } from 'vitest';
import { fracToRect, FULL_FRAC, rectToFrac } from './cropFrac';

describe('cropFrac', () => {
  it('round-trips between pixels and fractions', () => {
    const rect = { x: 100, y: 50, w: 400, h: 300 };
    expect(fracToRect(rectToFrac(rect, 800, 600), 800, 600)).toEqual(rect);
  });

  it('scales the same fractional crop to images of different sizes', () => {
    const frac = { x: 0.5, y: 0, w: 0.5, h: 1 };
    expect(fracToRect(frac, 1000, 500)).toEqual({ x: 500, y: 0, w: 500, h: 500 });
    expect(fracToRect(frac, 200, 400)).toEqual({ x: 100, y: 0, w: 100, h: 400 });
  });

  it('falls back to the full image for zero-size bounds', () => {
    expect(rectToFrac({ x: 1, y: 1, w: 1, h: 1 }, 0, 100)).toEqual(FULL_FRAC);
  });
});
