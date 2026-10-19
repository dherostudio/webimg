import { describe, expect, it } from 'vitest';
import { formatHsl, formatRgb, hexToHsl, hexToRgb, hslToHex, parseColor } from './color';

describe('parseColor', () => {
  it.each([
    ['#fff', '#ffffff'],
    ['#0A84FF', '#0a84ff'],
    ['0a84ff', '#0a84ff'],
    ['  #abc  ', '#aabbcc'],
    ['rgb(255, 0, 0)', '#ff0000'],
    ['rgba(0,128,255,0.5)', '#0080ff'],
    ['rgb(255 0 0 / 50%)', '#ff0000'],
    ['hsl(0, 100%, 50%)', '#ff0000'],
    ['hsl(120,100%,25%)', '#008000'],
    ['hsla(240, 100%, 50%, 0.3)', '#0000ff'],
  ])('%s → %s', (input, expected) => {
    expect(parseColor(input)).toBe(expected);
  });

  it('clamps out-of-range rgb channels', () => {
    expect(parseColor('rgb(300, 0, 0)')).toBe('#ff0000');
  });

  it.each(['', 'red', '#ff', '#gggggg', 'rgb(1,2)'])('rejects %j', (input) => {
    expect(parseColor(input)).toBeNull();
  });
});

describe('hex ↔ rgb/hsl', () => {
  it('converts hex to rgb', () => {
    expect(hexToRgb('#0a84ff')).toEqual({ r: 10, g: 132, b: 255 });
    expect(hexToRgb('#fff')).toBeNull();
  });

  it('round-trips primary colours through hsl', () => {
    for (const hex of ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000']) {
      const hsl = hexToHsl(hex)!;
      expect(hslToHex(hsl.h, hsl.s / 100, hsl.l / 100)).toBe(hex);
    }
  });

  it('wraps negative hues', () => {
    expect(hslToHex(-120, 1, 0.5)).toBe(hslToHex(240, 1, 0.5));
  });

  it('formats for display', () => {
    expect(formatRgb('#0a84ff')).toBe('rgb(10, 132, 255)');
    expect(formatHsl('#ff0000')).toBe('hsl(0, 100%, 50%)');
    expect(formatRgb('nope')).toBe('');
  });
});
