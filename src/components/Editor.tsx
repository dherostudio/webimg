import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CropRect, Rotation } from '../types';
import { buildOrientedSource } from '../utils/orient';

interface Props {
  source: HTMLImageElement;
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  crop: CropRect;
  theme: 'light' | 'dark';
  onCropChange: (crop: CropRect) => void;
  onZoomChange?: (zoom: number) => void;
}

export interface EditorHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (factor: number) => void;
  fit: () => void;
  actualSize: () => void;
}

type DragMode =
  | { kind: 'none' }
  | { kind: 'pan'; startX: number; startY: number; startPan: { x: number; y: number } }
  | { kind: 'move'; startX: number; startY: number; startCrop: CropRect }
  | {
      kind: 'resize';
      handle: 'nw' | 'ne' | 'sw' | 'se';
      startX: number;
      startY: number;
      startCrop: CropRect;
    };

const HANDLE_SIZE = 11;
const ZOOM_MIN = 0.05;
const ZOOM_MAX = 16;

export const Editor = forwardRef<EditorHandle, Props>(function Editor(
  { source, rotation, flipH, flipV, crop, theme, onCropChange, onZoomChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1); // pixels per source unit
  const [pan, setPan] = useState({ x: 0, y: 0 }); // canvas-pixel offset of source origin
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [hoverCursor, setHoverCursor] = useState<string>('default');
  const dragRef = useRef<DragMode>({ kind: 'none' });
  const initializedFor = useRef<string>('');

  const oriented = useMemo(
    () => buildOrientedSource(source, rotation, flipH, flipV),
    [source, rotation, flipH, flipV]
  );

  const fitScale = useMemo(() => {
    if (containerSize.w === 0 || containerSize.h === 0) return 1;
    const padding = 60;
    const sx = (containerSize.w - padding) / oriented.width;
    const sy = (containerSize.h - padding) / oriented.height;
    return Math.min(sx, sy, 1);
  }, [containerSize, oriented.width, oriented.height]);

  // Notify parent of zoom changes
  useEffect(() => {
    onZoomChange?.(scale);
  }, [scale, onZoomChange]);

  // Initialize / reset view when source or rotation changes
  useEffect(() => {
    const key = `${oriented.width}x${oriented.height}`;
    if (initializedFor.current === key) return;
    if (containerSize.w === 0) return;
    initializedFor.current = key;
    setScale(fitScale);
    setPan({
      x: (containerSize.w - oriented.width * fitScale) / 2,
      y: (containerSize.h - oriented.height * fitScale) / 2,
    });
  }, [oriented.width, oriented.height, fitScale, containerSize]);

  // Track container size
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setContainerSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track spacebar for pan mode
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        const t = e.target as HTMLElement;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return;
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const zoomAt = useCallback(
    (factor: number, anchor?: { x: number; y: number }) => {
      setScale((prev) => {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev * factor));
        const ratio = next / prev;
        const ax = anchor?.x ?? containerSize.w / 2;
        const ay = anchor?.y ?? containerSize.h / 2;
        setPan((p) => ({
          x: ax - (ax - p.x) * ratio,
          y: ay - (ay - p.y) * ratio,
        }));
        return next;
      });
    },
    [containerSize]
  );

  const fit = useCallback(() => {
    setScale(fitScale);
    setPan({
      x: (containerSize.w - oriented.width * fitScale) / 2,
      y: (containerSize.h - oriented.height * fitScale) / 2,
    });
  }, [fitScale, containerSize, oriented.width, oriented.height]);

  const actualSize = useCallback(() => {
    setScale(1);
    setPan({
      x: (containerSize.w - oriented.width) / 2,
      y: (containerSize.h - oriented.height) / 2,
    });
  }, [containerSize, oriented.width, oriented.height]);

  useImperativeHandle(
    ref,
    () => ({
      zoomIn: () => zoomAt(1.25),
      zoomOut: () => zoomAt(0.8),
      zoomTo: (factor: number) => {
        setScale(() => {
          const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, factor));
          setPan({
            x: (containerSize.w - oriented.width * next) / 2,
            y: (containerSize.h - oriented.height * next) / 2,
          });
          return next;
        });
      },
      fit,
      actualSize,
    }),
    [zoomAt, fit, actualSize, containerSize, oriented.width, oriented.height]
  );

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerSize.w === 0 || containerSize.h === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerSize.w * dpr;
    canvas.height = containerSize.h * dpr;
    canvas.style.width = `${containerSize.w}px`;
    canvas.style.height = `${containerSize.h}px`;

    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = scale < 4;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, containerSize.w, containerSize.h);

    // Draw image: pan + scale
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);
    ctx.drawImage(oriented, 0, 0);
    ctx.restore();

    // Crop overlay (in canvas pixel coords)
    const cx = pan.x + crop.x * scale;
    const cy = pan.y + crop.y * scale;
    const cw = crop.w * scale;
    const ch = crop.h * scale;

    // Image-bounded dim region (only over the image area, not the void)
    const imgX = pan.x;
    const imgY = pan.y;
    const imgW = oriented.width * scale;
    const imgH = oriented.height * scale;

    const isLight = theme === 'light';
    ctx.save();
    ctx.fillStyle = isLight ? 'rgba(244, 244, 246, 0.6)' : 'rgba(10, 10, 12, 0.55)';
    // top
    ctx.fillRect(imgX, imgY, imgW, cy - imgY);
    // bottom
    ctx.fillRect(imgX, cy + ch, imgW, imgY + imgH - (cy + ch));
    // left
    ctx.fillRect(imgX, cy, cx - imgX, ch);
    // right
    ctx.fillRect(cx + cw, cy, imgX + imgW - (cx + cw), ch);
    ctx.restore();

    // Crop frame
    ctx.strokeStyle = isLight ? '#0a0a0c' : '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);

    // Rule-of-thirds (only when crop is large enough)
    if (cw > 60 && ch > 60) {
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let i = 1; i <= 2; i++) {
        ctx.moveTo(cx + (cw * i) / 3, cy);
        ctx.lineTo(cx + (cw * i) / 3, cy + ch);
        ctx.moveTo(cx, cy + (ch * i) / 3);
        ctx.lineTo(cx + cw, cy + (ch * i) / 3);
      }
      ctx.stroke();
    }

    // Corner handles
    const handleFill = isLight ? '#0a0a0c' : '#ffffff';
    const handleStroke = isLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)';
    const drawHandle = (hx: number, hy: number) => {
      ctx.fillStyle = handleFill;
      ctx.strokeStyle = handleStroke;
      ctx.lineWidth = 0.5;
      const s = HANDLE_SIZE;
      ctx.fillRect(hx - s / 2, hy - s / 2, s, s);
      ctx.strokeRect(hx - s / 2 + 0.5, hy - s / 2 + 0.5, s - 1, s - 1);
    };
    drawHandle(cx, cy);
    drawHandle(cx + cw, cy);
    drawHandle(cx, cy + ch);
    drawHandle(cx + cw, cy + ch);
  }, [oriented, crop, scale, pan, containerSize, theme]);

  function getPoint(e: React.PointerEvent | WheelEvent): { x: number; y: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function hitTest(px: number, py: number): DragMode {
    const cx = pan.x + crop.x * scale;
    const cy = pan.y + crop.y * scale;
    const cw = crop.w * scale;
    const ch = crop.h * scale;
    const half = HANDLE_SIZE / 2 + 3;
    const inHandle = (hx: number, hy: number) =>
      px >= hx - half && px <= hx + half && py >= hy - half && py <= hy + half;

    if (inHandle(cx, cy)) return { kind: 'resize', handle: 'nw', startX: px, startY: py, startCrop: crop };
    if (inHandle(cx + cw, cy)) return { kind: 'resize', handle: 'ne', startX: px, startY: py, startCrop: crop };
    if (inHandle(cx, cy + ch)) return { kind: 'resize', handle: 'sw', startX: px, startY: py, startCrop: crop };
    if (inHandle(cx + cw, cy + ch)) return { kind: 'resize', handle: 'se', startX: px, startY: py, startCrop: crop };
    if (px >= cx && px <= cx + cw && py >= cy && py <= cy + ch) {
      return { kind: 'move', startX: px, startY: py, startCrop: crop };
    }
    return { kind: 'none' };
  }

  function cursorFor(mode: DragMode): string {
    if (mode.kind === 'pan') return 'grabbing';
    if (mode.kind === 'move') return 'grabbing';
    if (mode.kind === 'resize') {
      return mode.handle === 'nw' || mode.handle === 'se' ? 'nwse-resize' : 'nesw-resize';
    }
    return 'default';
  }

  function clampCrop(c: CropRect): CropRect {
    const maxW = oriented.width;
    const maxH = oriented.height;
    let { x, y, w, h } = c;
    w = Math.max(8, Math.min(maxW, w));
    h = Math.max(8, Math.min(maxH, h));
    x = Math.max(0, Math.min(maxW - w, x));
    y = Math.max(0, Math.min(maxH - h, y));
    return { x, y, w, h };
  }

  function onPointerDown(e: React.PointerEvent) {
    const p = getPoint(e);
    // Pan: space held, middle mouse, or right-click drag
    if (spaceHeld || e.button === 1 || e.button === 2) {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { kind: 'pan', startX: p.x, startY: p.y, startPan: { ...pan } };
      return;
    }
    const mode = hitTest(p.x, p.y);
    if (mode.kind === 'none') {
      // Empty area drag = pan
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { kind: 'pan', startX: p.x, startY: p.y, startPan: { ...pan } };
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = mode;
  }

  function onPointerMove(e: React.PointerEvent) {
    const p = getPoint(e);
    const mode = dragRef.current;

    if (mode.kind === 'none') {
      const hover = hitTest(p.x, p.y);
      const cursor = spaceHeld
        ? 'grab'
        : hover.kind === 'move'
          ? 'grab'
          : hover.kind === 'resize'
            ? cursorFor(hover)
            : 'grab';
      if (cursor !== hoverCursor) setHoverCursor(cursor);
      return;
    }

    if (mode.kind === 'pan') {
      const dx = p.x - mode.startX;
      const dy = p.y - mode.startY;
      setPan({ x: mode.startPan.x + dx, y: mode.startPan.y + dy });
      return;
    }

    const dx = (p.x - mode.startX) / scale;
    const dy = (p.y - mode.startY) / scale;
    const start = mode.startCrop;

    if (mode.kind === 'move') {
      onCropChange(clampCrop({ x: start.x + dx, y: start.y + dy, w: start.w, h: start.h }));
      return;
    }

    if (mode.kind === 'resize') {
      let { x, y, w, h } = start;
      switch (mode.handle) {
        case 'nw':
          x = start.x + dx;
          y = start.y + dy;
          w = start.w - dx;
          h = start.h - dy;
          break;
        case 'ne':
          y = start.y + dy;
          w = start.w + dx;
          h = start.h - dy;
          break;
        case 'sw':
          x = start.x + dx;
          w = start.w - dx;
          h = start.h + dy;
          break;
        case 'se':
          w = start.w + dx;
          h = start.h + dy;
          break;
      }
      if (w < 8) {
        x = start.x + start.w - 8;
        w = 8;
      }
      if (h < 8) {
        y = start.y + start.h - 8;
        h = 8;
      }
      onCropChange(clampCrop({ x, y, w, h }));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current = { kind: 'none' };
  }

  // Wheel: zoom (with Cmd/Ctrl) or trackpad pinch, otherwise pan
  function onWheel(e: React.WheelEvent) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const p = getPoint(e.nativeEvent);
      const factor = Math.exp(-e.deltaY * 0.01);
      zoomAt(factor, p);
    } else {
      e.preventDefault();
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }

  // Prevent context menu so right-click can pan
  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <div
      ref={containerRef}
      className="editor-viewport"
      style={{ cursor: hoverCursor }}
    >
      {containerSize.w > 0 && (
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          onContextMenu={onContextMenu}
        />
      )}
    </div>
  );
});
