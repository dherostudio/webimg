import JSZip from 'jszip';
import { useCallback, useMemo, useRef, useState } from 'react';
import { BatchSidebar } from './components/BatchSidebar';
import { Editor, type EditorHandle } from './components/Editor';
import { Inspector } from './components/Inspector';
import { Landing } from './components/Landing';
import { Toolbar } from './components/Toolbar';
import { TopBar } from './components/TopBar';
import { ZoomHud } from './components/ZoomHud';
import type { BatchItem, BgColor, CropFrac, CropRect, FitMode, OutputFormat, Rotation } from './types';
import { useTheme } from './useTheme';
import { fracToRect, FULL_FRAC, orientedDims, rectToFrac } from './utils/cropFrac';
import { downloadBlob, exportImage } from './utils/exportImage';
import { extensionFor, toSlug } from './utils/slug';
import { makeThumbnail } from './utils/thumbnail';
import './App.css';

type StatusKind = 'success' | 'error' | 'info';
interface Status {
  kind: StatusKind;
  message: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
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

let nextBatchId = 1;
function newId(): string {
  return `b${nextBatchId++}`;
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const editorRef = useRef<EditorHandle>(null);
  const dropAddRef = useRef<HTMLInputElement>(null);

  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [cropFrac, setCropFrac] = useState<CropFrac>(FULL_FRAC);
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
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [zoom, setZoom] = useState(1);

  const activeItem = useMemo(
    () => batch.find((b) => b.id === activeId) ?? null,
    [batch, activeId]
  );

  // Active image's oriented dimensions — used to translate fraction crop to pixel crop
  const activeDims = useMemo(() => {
    if (!activeItem) return { w: 0, h: 0 };
    return orientedDims(activeItem.source, rotation);
  }, [activeItem, rotation]);

  const cropRect: CropRect = useMemo(
    () => fracToRect(cropFrac, activeDims.w, activeDims.h),
    [cropFrac, activeDims]
  );

  const cropAspect = cropRect.w > 0 && cropRect.h > 0 ? cropRect.w / cropRect.h : 1;

  const handleFiles = useCallback(async (files: File[]) => {
    setStatus(null);
    try {
      const newItems: BatchItem[] = [];
      for (const file of files) {
        const source = await loadImage(file);
        const thumbnailUrl = await makeThumbnail(source);
        newItems.push({
          id: newId(),
          source,
          originalFilename: file.name,
          customFilename: stripExt(file.name),
          thumbnailUrl,
        });
      }
      setBatch((prev) => {
        const next = [...prev, ...newItems];
        // First import: initialize crop + dims based on the first new item
        if (prev.length === 0 && newItems.length > 0) {
          const first = newItems[0];
          setActiveId(first.id);
          const w = first.source.naturalWidth;
          const h = first.source.naturalHeight;
          setCropFrac(FULL_FRAC);
          setOutputWidth(w);
          setOutputHeight(h);
          setRotation(0);
          setFlipH(false);
          setFlipV(false);
        }
        return next;
      });
    } catch (e) {
      setStatus({ kind: 'error', message: `Failed to load: ${(e as Error).message}` });
    }
  }, []);

  const handleSelectItem = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleRenameItem = useCallback((id: string, name: string) => {
    setBatch((prev) => prev.map((b) => (b.id === id ? { ...b, customFilename: name } : b)));
  }, []);

  const handleRemoveItem = useCallback(
    (id: string) => {
      setBatch((prev) => {
        const next = prev.filter((b) => b.id !== id);
        if (id === activeId) {
          setActiveId(next[0]?.id ?? null);
        }
        if (next.length === 0) {
          // Reset transient state
          setCropFrac(FULL_FRAC);
          setOutputWidth(0);
          setOutputHeight(0);
        }
        return next;
      });
    },
    [activeId]
  );

  const handleAddMore = useCallback(() => {
    dropAddRef.current?.click();
  }, []);

  const handleCropChange = useCallback(
    (next: CropRect) => {
      if (activeDims.w === 0 || activeDims.h === 0) return;
      const frac = rectToFrac(next, activeDims.w, activeDims.h);
      setCropFrac(frac);
      if (aspectLocked && outputWidth > 0 && next.h > 0) {
        setOutputHeight(Math.max(1, Math.round(outputWidth / (next.w / next.h))));
      }
    },
    [activeDims, aspectLocked, outputWidth]
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
    if (!activeItem) return;
    const dims = orientedDims(activeItem.source, rotation);
    setCropFrac(FULL_FRAC);
    setOutputWidth(dims.w);
    setOutputHeight(dims.h);
  }, [activeItem, rotation]);

  const handleRotate = useCallback(
    (next: Rotation) => {
      if (!activeItem) return;
      const dims = orientedDims(activeItem.source, next);
      setRotation(next);
      setCropFrac(FULL_FRAC);
      setOutputWidth(dims.w);
      setOutputHeight(dims.h);
    },
    [activeItem]
  );

  const handleResetTransform = useCallback(() => {
    handleRotate(0);
    setFlipH(false);
    setFlipV(false);
  }, [handleRotate]);

  // Single-image export
  const exportSingle = useCallback(
    async (item: BatchItem) => {
      const dims = orientedDims(item.source, rotation);
      const pixCrop = fracToRect(cropFrac, dims.w, dims.h);
      const result = await exportImage({
        source: item.source,
        crop: pixCrop,
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
      const slug = toSlug(item.customFilename) || 'image';
      const filename = `${slug}.${extensionFor(result.format)}`;
      return { filename, blob: result.blob, fellBack: result.fellBack };
    },
    [cropFrac, outputWidth, outputHeight, rotation, flipH, flipV, format, quality, fit, bg]
  );

  const handleExport = useCallback(async () => {
    if (batch.length === 0) return;
    setBusy(true);
    setStatus(null);
    try {
      if (batch.length === 1) {
        const out = await exportSingle(batch[0]);
        downloadBlob(out.blob, out.filename);
        const sizeKb = (out.blob.size / 1024).toFixed(1);
        setStatus({
          kind: out.fellBack ? 'info' : 'success',
          message: out.fellBack
            ? `Saved ${out.filename} · ${sizeKb} KB · AVIF unsupported, used WebP`
            : `Saved ${out.filename} · ${sizeKb} KB`,
        });
      } else {
        // Batch: package as ZIP
        const zip = new JSZip();
        let fellBackAny = false;
        const usedNames = new Set<string>();
        for (const item of batch) {
          const out = await exportSingle(item);
          if (out.fellBack) fellBackAny = true;
          // Disambiguate duplicate filenames
          let name = out.filename;
          if (usedNames.has(name)) {
            const dot = name.lastIndexOf('.');
            const base = name.slice(0, dot);
            const ext = name.slice(dot);
            let n = 2;
            while (usedNames.has(`${base}-${n}${ext}`)) n++;
            name = `${base}-${n}${ext}`;
          }
          usedNames.add(name);
          zip.file(name, out.blob);
        }
        const blob = await zip.generateAsync({ type: 'blob' });
        const stamp = new Date().toISOString().slice(0, 10);
        downloadBlob(blob, `webimg-batch-${stamp}.zip`);
        const sizeKb = (blob.size / 1024).toFixed(1);
        setStatus({
          kind: fellBackAny ? 'info' : 'success',
          message: fellBackAny
            ? `Exported ${batch.length} images · ${sizeKb} KB · AVIF→WebP fallback used`
            : `Exported ${batch.length} images · ${sizeKb} KB`,
        });
      }
      setTimeout(() => setStatus(null), 5000);
    } catch (e) {
      setStatus({ kind: 'error', message: `Export failed: ${(e as Error).message}` });
    } finally {
      setBusy(false);
    }
  }, [batch, exportSingle]);

  const handleClearAll = useCallback(() => {
    setBatch([]);
    setActiveId(null);
    setStatus(null);
  }, []);

  const handleHome = useCallback(() => {
    document.querySelector('.app--landing')?.scrollTo({ top: 0 });
  }, []);

  const sourceDims = useMemo(() => {
    if (!activeItem) return { w: null as number | null, h: null as number | null };
    const d = orientedDims(activeItem.source, rotation);
    return { w: d.w, h: d.h };
  }, [activeItem, rotation]);

  const isBatch = batch.length > 1;
  const headerFilename = isBatch
    ? `${batch.length} images`
    : activeItem?.originalFilename ?? null;

  return (
    <div className={`app${batch.length === 0 ? ' app--landing' : ''}`}>
      <div className="app__bg" aria-hidden />
      <TopBar
        filename={headerFilename}
        width={isBatch ? null : sourceDims.w}
        height={isBatch ? null : sourceDims.h}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLoadNew={batch.length > 0 ? handleClearAll : undefined}
        onHome={batch.length === 0 ? handleHome : handleClearAll}
      />

      {/* Hidden input used by "Add more" button */}
      <input
        ref={dropAddRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />

      {batch.length === 0 ? (
        <Landing onFiles={handleFiles} />
      ) : (
        <main className={`stage${isBatch ? ' stage--batch' : ''}`}>
          {activeItem && (
            <Editor
              ref={editorRef}
              source={activeItem.source}
              rotation={rotation}
              flipH={flipH}
              flipV={flipV}
              crop={cropRect}
              theme={theme}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            />
          )}

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

          {isBatch && (
            <BatchSidebar
              items={batch}
              activeId={activeId}
              onSelect={handleSelectItem}
              onRename={handleRenameItem}
              onRemove={handleRemoveItem}
              onAdd={handleAddMore}
            />
          )}

          {activeItem && (
            <Inspector
              source={activeItem.source}
              crop={cropRect}
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
              filenameInput={activeItem.customFilename}
              cropAspect={cropAspect}
              busy={busy}
              theme={theme}
              isBatch={isBatch}
              batchCount={batch.length}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
              onAspectLockedChange={setAspectLocked}
              onResetCrop={handleResetCrop}
              onFitChange={setFit}
              onBgChange={setBg}
              onCustomColorChange={setCustomColor}
              onFormatChange={setFormat}
              onQualityChange={setQuality}
              onFilenameChange={(name) => handleRenameItem(activeItem.id, name)}
              onExport={handleExport}
            />
          )}
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
