import { useEffect, useMemo, useRef } from 'react';
import type { BgColor, CropRect, FitMode, OutputFormat, Rotation } from '../types';
import { bgColorValue, computeFit, drawCheckerboardThemed } from '../utils/fit';
import { buildOrientedSource } from '../utils/orient';

interface Props {
  source: HTMLImageElement;
  crop: CropRect;
  outputWidth: number;
  outputHeight: number;
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  fit: FitMode;
  bg: BgColor;
  format: OutputFormat;
  theme: 'light' | 'dark';
}

const MAX_W = 252;
const MAX_H = 168;

export function PreviewTile(props: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const oriented = useMemo(
    () => buildOrientedSource(props.source, props.rotation, props.flipH, props.flipV),
    [props.source, props.rotation, props.flipH, props.flipV]
  );

  const display = useMemo(() => {
    if (props.outputWidth <= 0 || props.outputHeight <= 0) {
      return { w: 0, h: 0 };
    }
    const aspect = props.outputWidth / props.outputHeight;
    let w = MAX_W;
    let h = MAX_W / aspect;
    if (h > MAX_H) {
      h = MAX_H;
      w = MAX_H * aspect;
    }
    return { w: Math.round(w), h: Math.round(h) };
  }, [props.outputWidth, props.outputHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || display.w === 0 || display.h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = display.w * dpr;
    canvas.height = display.h * dpr;
    canvas.style.width = `${display.w}px`;
    canvas.style.height = `${display.h}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background: checkerboard for transparent, otherwise solid fill
    const bgVal = bgColorValue(props.bg, props.format);
    if (bgVal) {
      ctx.fillStyle = bgVal;
      ctx.fillRect(0, 0, display.w, display.h);
    } else {
      drawCheckerboardThemed(ctx, display.w, display.h, props.theme);
    }

    // Map output coords → display coords
    const previewScale = display.w / props.outputWidth;
    const fit = computeFit(props.crop.w, props.crop.h, props.outputWidth, props.outputHeight, props.fit);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // For cover, clip to output box (here = canvas) — already implicit
    ctx.drawImage(
      oriented,
      props.crop.x,
      props.crop.y,
      props.crop.w,
      props.crop.h,
      fit.dx * previewScale,
      fit.dy * previewScale,
      fit.dw * previewScale,
      fit.dh * previewScale
    );
  }, [
    oriented,
    props.crop,
    props.outputWidth,
    props.outputHeight,
    props.fit,
    props.bg,
    props.format,
    props.theme,
    display,
  ]);

  if (display.w === 0) return null;

  return (
    <div className="preview-tile">
      <canvas ref={canvasRef} />
      <div className="preview-tile__caption mono">
        {props.outputWidth} × {props.outputHeight}
      </div>
    </div>
  );
}
