import lottie, { type AnimationItem } from 'lottie-web/build/player/lottie_light';
import { useEffect, useRef } from 'react';
import type { Theme } from '../useTheme';

interface Props {
  /** Path under /icons, e.g. "/icons/crop-straighten.json" */
  src: string;
  size?: number;
  theme: Theme;
  className?: string;
  /** Force a crisp line-icon treatment (strokes only, fills hidden). */
  lineArt?: boolean;
}

/** Two-tone monochrome targets per theme — matches --text / --text-2. */
const TONES: Record<Theme, { primary: [number, number, number]; secondary: [number, number, number] }> = {
  // #f5f5f7 / #a1a1a6
  dark: { primary: [0.961, 0.961, 0.969], secondary: [0.631, 0.631, 0.651] },
  // #1c1c1e / #555558
  light: { primary: [0.11, 0.11, 0.118], secondary: [0.333, 0.333, 0.345] },
};

/** Cache raw fetched JSON so repeated mounts / theme flips don't refetch. */
const rawCache = new Map<string, Promise<unknown>>();
function loadRaw(src: string): Promise<unknown> {
  let p = rawCache.get(src);
  if (!p) {
    p = fetch(src).then((r) => r.json());
    rawCache.set(src, p);
  }
  return p;
}

/** Perceived luminance of a 0..1 RGB triple. */
function luma([r, g, b]: number[]): number {
  return 0.2126 * r + 0.7152 * g + 0.4114 * b;
}

/**
 * Walk a Lottie doc and remap every static fill/stroke color to the theme's
 * two-tone palette: near-black lines → primary text, everything else → muted
 * secondary. Mutates a structural clone, leaving the cached raw doc untouched.
 *
 * `lineArt` is for fill-heavy artwork (e.g. the batch icon) that would
 * otherwise read as a muted blob: strokes are forced to primary and fills are
 * made transparent, collapsing it to a crisp white line icon like the rest.
 */
function recolor(data: unknown, theme: Theme, lineArt = false): unknown {
  const clone = structuredClone(data);
  const { primary, secondary } = TONES[theme];
  const visit = (o: unknown): void => {
    if (Array.isArray(o)) {
      o.forEach(visit);
      return;
    }
    if (o && typeof o === 'object') {
      const node = o as Record<string, unknown>;
      const ty = node.ty;
      if ((ty === 'fl' || ty === 'st') && node.c && typeof node.c === 'object') {
        const c = node.c as { a?: number; k?: number[] };
        if (c.a === 0 && Array.isArray(c.k)) {
          if (lineArt) {
            if (ty === 'fl') c.k = [c.k[0], c.k[1], c.k[2], 0];
            else c.k = [primary[0], primary[1], primary[2], c.k[3] ?? 1];
          } else {
            const tone = luma(c.k) < 0.5 ? primary : secondary;
            c.k = [tone[0], tone[1], tone[2], c.k[3] ?? 1];
          }
        }
      }
      Object.values(node).forEach(visit);
    }
  };
  visit(clone);
  return clone;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function LottieIcon({ src, size = 40, theme, className, lineArt = false }: Props) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    loadRaw(src).then((raw) => {
      if (cancelled || !hostRef.current) return;
      const anim = lottie.loadAnimation({
        container: hostRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: !prefersReducedMotion(),
        animationData: recolor(raw, theme, lineArt),
        rendererSettings: { progressiveLoad: true },
      });
      animRef.current = anim;
    });

    // Replay when the user hovers the surrounding card.
    const card = host.closest<HTMLElement>('.magic-card') ?? host;
    const replay = () => {
      if (prefersReducedMotion()) return;
      animRef.current?.goToAndPlay(0, true);
    };
    card.addEventListener('mouseenter', replay);

    return () => {
      cancelled = true;
      card.removeEventListener('mouseenter', replay);
      animRef.current?.destroy();
      animRef.current = null;
    };
    // Re-init on theme change so colors are baked for the active theme.
  }, [src, theme, lineArt]);

  return (
    <span
      ref={hostRef}
      className={className}
      style={{ width: size, height: size, display: 'block' }}
      aria-hidden
    />
  );
}
