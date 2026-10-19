import { describe, expect, it } from 'vitest';
import { bgColorValue, computeFit } from './fit';

describe('computeFit', () => {
  it('stretch fills the box', () => {
    expect(computeFit(400, 100, 200, 200, 'stretch')).toEqual({ dx: 0, dy: 0, dw: 200, dh: 200 });
  });

  it('contain letterboxes a wide crop top and bottom', () => {
    expect(computeFit(400, 200, 200, 200, 'contain')).toEqual({ dx: 0, dy: 50, dw: 200, dh: 100 });
  });

  it('contain pillarboxes a tall crop left and right', () => {
    expect(computeFit(200, 400, 200, 200, 'contain')).toEqual({ dx: 50, dy: 0, dw: 100, dh: 200 });
  });

  it('cover overflows a wide crop horizontally', () => {
    expect(computeFit(400, 200, 200, 200, 'cover')).toEqual({ dx: -100, dy: 0, dw: 400, dh: 200 });
  });

  it('cover overflows a tall crop vertically', () => {
    expect(computeFit(200, 400, 200, 200, 'cover')).toEqual({ dx: 0, dy: -100, dw: 200, dh: 400 });
  });

  it('matching aspect fills exactly in every mode', () => {
    for (const mode of ['contain', 'cover', 'stretch'] as const) {
      expect(computeFit(800, 600, 400, 300, mode)).toEqual({ dx: 0, dy: 0, dw: 400, dh: 300 });
    }
  });

  it('degenerate crop falls back to filling the box', () => {
    expect(computeFit(0, 100, 50, 50, 'contain')).toEqual({ dx: 0, dy: 0, dw: 50, dh: 50 });
  });
});

describe('bgColorValue', () => {
  it('keeps transparency except for JPEG, which gets white', () => {
    expect(bgColorValue('transparent', 'png')).toBeNull();
    expect(bgColorValue('transparent', 'webp')).toBeNull();
    expect(bgColorValue('transparent', 'jpeg')).toBe('#ffffff');
  });

  it('passes colours through', () => {
    expect(bgColorValue('#ff0000', 'jpeg')).toBe('#ff0000');
  });
});
