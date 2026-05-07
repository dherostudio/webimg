/**
 * Parse a user-typed color string and return canonical lowercase hex (`#rrggbb`).
 * Accepts: `#fff`, `#ffffff`, `ffffff`, `rgb(255,255,255)`, `rgba(...)`, `hsl(0,0%,100%)`, `hsla(...)`.
 * Returns null if the input can't be parsed.
 */
export function parseColor(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Hex
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(trimmed);
  if (hex) {
    let v = hex[1];
    if (v.length === 3) v = v.split('').map((c) => c + c).join('');
    return `#${v}`;
  }

  // rgb / rgba
  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*[\d.%]+)?\s*\)$/.exec(
    trimmed
  );
  if (rgb) {
    const r = clamp255(parseFloat(rgb[1]));
    const g = clamp255(parseFloat(rgb[2]));
    const b = clamp255(parseFloat(rgb[3]));
    return rgbToHex(r, g, b);
  }

  // hsl / hsla
  const hsl = /^hsla?\(\s*(\d+(?:\.\d+)?)\s*,?\s*(\d+(?:\.\d+)?)%\s*,?\s*(\d+(?:\.\d+)?)%(?:\s*[,/]\s*[\d.%]+)?\s*\)$/.exec(
    trimmed
  );
  if (hsl) {
    const h = parseFloat(hsl[1]);
    const s = parseFloat(hsl[2]) / 100;
    const l = parseFloat(hsl[3]) / 100;
    return hslToHex(h, s, l);
  }

  return null;
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => clamp255(n).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return null;
  const v = m[1];
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hp = (((h % 360) + 360) % 360) / 60;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = l - c / 2;
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Format helpers for display */
export function formatRgb(hex: string): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
}

export function formatHsl(hex: string): string {
  const hsl = hexToHsl(hex);
  return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';
}
