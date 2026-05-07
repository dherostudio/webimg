import { useCallback, useMemo, useRef, useState } from 'react';
import { DropZone } from './components/DropZone';
import { Editor, type EditorHandle } from './components/Editor';
import { Inspector } from './components/Inspector';
import { Toolbar } from './components/Toolbar';
import { TopBar } from './components/TopBar';
import { ZoomHud } from './components/ZoomHud';
import type { BgColor, CropRect, FitMode, OutputFormat, Rotation } from './types';
import { useTheme } from './useTheme';
import { downloadBlob, exportImage } from './utils/exportImage';
import { extensionFor, toSlug } from './utils/slug';
import './App.css';

type StatusKind = 'success' | 'error' | 'info';
interface Status {
  kind: StatusKind;
  message: string;
}

interface LoadedImage {
  source: HTMLImageElement;
  filename: string;
}

function loadImage(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ source: img, filename: file.name });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode image'));
    };
    img.src = url;
  });
}

function stripExt(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const editorRef = useRef<EditorHandle>(null);
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 });
  const [outputWidth, setOutputWidth] = useState(0);
  const [outputHeight, setOutputHeight] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [rotation, setRotation] = useState<Rotation>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState<OutputFormat>('webp');
  const [quality, setQuality] = useState(85);
  const [fit, setFit] = useState<FitMode>('contain');
  const [bg, setBg] = useState<BgColor>('transparent');
  const [customColor, setCustomColor] = useState('#0a84ff');
  const [filenameInput, setFilenameInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleFile = useCallback(async (file: File) => {
    try {
      const result = await loadImage(file);
      setLoaded(result);
      const w = result.source.naturalWidth;
      const h = result.source.naturalHeight;
      setCrop({ x: 0, y: 0, w, h });
      setOutputWidth(w);
      setOutputHeight(h);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setFilenameInput(stripExt(file.name));
      setStatus(null);
    } catch (e) {
      setStatus({ kind: 'error', message: `Failed to load image: ${(e as Error).message}` });
    }
  }, []);

  const cropAspect = crop.w > 0 && crop.h > 0 ? crop.w / crop.h : 1;

  const handleCropChange = useCallback(
    (next: CropRect) => {
      setCrop(next);
      if (aspectLocked && outputWidth > 0 && next.h > 0) {
        setOutputHeight(Math.max(1, Math.round(outputWidth / (next.w / next.h))));
      }
    },
    [aspectLocked, outputWidth]
  );

  const handleWidthChange = useCallback(
    (w: number) => {
      setOutputWidth(w);
      if (aspectLocked && cropAspect > 0) {
        setOutputHeight(Math.max(1, Math.round(w / cropAspect)));
      }
    },
    [aspectLocked, cropAspect]
  );

  const handleHeightChange = useCallback(
    (h: number) => {
      setOutputHeight(h);
      if (aspectLocked && cropAspect > 0) {
        setOutputWidth(Math.max(1, Math.round(h * cropAspect)));
      }
    },
    [aspectLocked, cropAspect]
  );

  const handleResetCrop = useCallback(() => {
    if (!loaded) return;
    const swapped = rotation === 90 || rotation === 270;
    const w = swapped ? loaded.source.naturalHeight : loaded.source.naturalWidth;
    const h = swapped ? loaded.source.naturalWidth : loaded.source.naturalHeight;
    setCrop({ x: 0, y: 0, w, h });
    setOutputWidth(w);
    setOutputHeight(h);
  }, [loaded, rotation]);

  const handleRotate = useCallback(
    (next: Rotation) => {
      if (!loaded) return;
      const swapped = next === 90 || next === 270;
      const w = swapped ? loaded.source.naturalHeight : loaded.source.naturalWidth;
      const h = swapped ? loaded.source.naturalWidth : loaded.source.naturalHeight;
      setRotation(next);
      setCrop({ x: 0, y: 0, w, h });
      setOutputWidth(w);
      setOutputHeight(h);
    },
    [loaded]
  );

  const handleResetTransform = useCallback(() => {
    handleRotate(0);
    setFlipH(false);
    setFlipV(false);
  }, [handleRotate]);

  const handleExport = useCallback(async () => {
    if (!loaded) return;
    setBusy(true);
    setStatus(null);
    try {
      const result = await exportImage({
        source: loaded.source,
        crop,
        outputWidth,
        outputHeight,
        rotation,
        flipH,
        flipV,
        format,
        quality,
        fit,
        bg,
      });
      const slug = toSlug(filenameInput) || 'image';
      const filename = `${slug}.${extensionFor(result.format)}`;
      downloadBlob(result.blob, filename);
      const sizeKb = (result.blob.size / 1024).toFixed(1);
      setStatus({
        kind: result.fellBack ? 'info' : 'success',
        message: result.fellBack
          ? `Saved ${filename} · ${sizeKb} KB · AVIF unsupported, used WebP`
          : `Saved ${filename} · ${sizeKb} KB`,
      });
      setTimeout(() => setStatus(null), 4000);
    } catch (e) {
      setStatus({ kind: 'error', message: `Export failed: ${(e as Error).message}` });
    } finally {
      setBusy(false);
    }
  }, [loaded, crop, outputWidth, outputHeight, rotation, flipH, flipV, format, quality, fit, bg, filenameInput]);

  const handleLoadNew = useCallback(() => {
    setLoaded(null);
    setStatus(null);
  }, []);

  const sourceDims = useMemo(() => {
    if (!loaded) return { w: null as number | null, h: null as number | null };
    const swapped = rotation === 90 || rotation === 270;
    return {
      w: swapped ? loaded.source.naturalHeight : loaded.source.naturalWidth,
      h: swapped ? loaded.source.naturalWidth : loaded.source.naturalHeight,
    };
  }, [loaded, rotation]);

  return (
    <div className="app">
      <div className="app__bg" aria-hidden />
      <TopBar
        filename={loaded?.filename ?? null}
        width={sourceDims.w}
        height={sourceDims.h}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoadNew={loaded ? handleLoadNew : undefined}
      />

      {!loaded ? (
        <main className="stage stage--empty">
          <DropZone onFile={handleFile} />
        </main>
      ) : (
        <main className="stage">
          <Editor
            ref={editorRef}
            source={loaded.source}
            rotation={rotation}
            flipH={flipH}
            flipV={flipV}
            crop={crop}
            theme={theme}
            onCropChange={handleCropChange}
            onZoomChange={setZoom}
          />

          <Toolbar
            rotation={rotation}
            flipH={flipH}
            flipV={flipV}
            onRotateChange={handleRotate}
            onFlipHChange={setFlipH}
            onFlipVChange={setFlipV}
            onResetTransform={handleResetTransform}
          />

          <ZoomHud
            zoom={zoom}
            onZoomIn={() => editorRef.current?.zoomIn()}
            onZoomOut={() => editorRef.current?.zoomOut()}
            onFit={() => editorRef.current?.fit()}
            onActualSize={() => editorRef.current?.actualSize()}
          />

          <Inspector
            source={loaded.source}
            crop={crop}
            rotation={rotation}
            flipH={flipH}
            flipV={flipV}
            outputWidth={outputWidth}
            outputHeight={outputHeight}
            aspectLocked={aspectLocked}
            fit={fit}
            bg={bg}
            customColor={customColor}
            format={format}
            quality={quality}
            filenameInput={filenameInput}
            cropAspect={cropAspect}
            busy={busy}
            theme={theme}
            onWidthChange={handleWidthChange}
            onHeightChange={handleHeightChange}
            onAspectLockedChange={setAspectLocked}
            onResetCrop={handleResetCrop}
            onFitChange={setFit}
            onBgChange={setBg}
            onCustomColorChange={setCustomColor}
            onFormatChange={setFormat}
            onQualityChange={setQuality}
            onFilenameChange={setFilenameInput}
            onExport={handleExport}
          />
        </main>
      )}

      {status && (
        <div className={`status-toast glass status-toast--${status.kind}`}>
          <span className="status-toast__dot" aria-hidden />
          {status.message}
        </div>
      )}
    </div>
  );
}
