import { describe, expect, it } from 'vitest';
import { extensionFor, toSlug } from './slug';

describe('toSlug', () => {
  it('lowercases, hyphenates and strips punctuation', () => {
    expect(toSlug('Mountain Landscape: Sunset!')).toBe('mountain-landscape-sunset');
  });

  it('transliterates accents', () => {
    expect(toSlug('Café Ñandú')).toBe('cafe-nandu');
  });

  it('returns empty for empty or symbol-only input', () => {
    expect(toSlug('')).toBe('');
    expect(toSlug('!!!')).toBe('');
  });
});

describe('extensionFor', () => {
  it('uses .jpg for JPEG and the format name otherwise', () => {
    expect(extensionFor('jpeg')).toBe('jpg');
    expect(extensionFor('webp')).toBe('webp');
    expect(extensionFor('avif')).toBe('avif');
    expect(extensionFor('png')).toBe('png');
  });
});
