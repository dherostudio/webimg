import { useEffect, useRef, useState } from 'react';
import type { BgColor, CropRect, FitMode, OutputFormat, Rotation } from '../types';
import { formatHsl, formatRgb, parseColor } from '../utils/color';
import { extensionFor, toSlug } from '../utils/slug';
import { DownloadIcon, LinkIcon, ResetIcon, UnlinkIcon } from './icons';
import { PreviewTile } from './PreviewTile';

interface Props {
  source: HTMLImageElement;
  crop: CropRect;
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  outputWidth: number;
  outputHeight: number;
  aspectLocked: boolean;
  fit: FitMode;
  bg: BgColor;
  customColor: string;
  format: OutputFormat;
  quality: number;
  filenameInput: string;
  cropAspect: number;
  busy: boolean;
  theme: 'light' | 'dark';
  isBatch: boolean;
  batchCount: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  onAspectLockedChange: (locked: boolean) => void;
  onResetCrop: () => void;
  onFitChange: (f: FitMode) => void;
  onBgChange: (b: BgColor) => void;
  onCustomColorChange: (hex: string) => void;
  onFormatChange: (f: OutputFormat) => void;
  onQualityChange: (q: number) => void;
  onFilenameChange: (name: string) => void;
  onExport: () => void;
}

export function Inspector(props: Props) {
  const slug = toSlug(props.filenameInput) || 'image';
  const previewName = `${slug}.${extensionFor(props.format)}`;

  const showFitControls = !props.aspectLocked;
  const showBgControls = showFitControls && props.fit !== 'cover';
  const transparentDisabled = props.format === 'jpeg';

  return (
    <aside className="inspector glass">
      <div className="inspector__scroll">
        <Group title="Crop">
          <Stat
            label="Selection"
            value={`${Math.round(props.crop.w)} × ${Math.round(props.crop.h)}`}
            unit="px"
          />
          <Stat label="Aspect" value={props.cropAspect.toFixed(3)} />
          <button className="ghost-btn" onClick={props.onResetCrop}>
            <ResetIcon size={14} />
            <span>Reset to full image</span>
          </button>
        </Group>

        <Group title="Output size">
          <div className="dim-row">
            <NumberField label="W" value={props.outputWidth} onChange={props.onWidthChange} />
            <button
              className={`link-btn${props.aspectLocked ? ' link-btn--on' : ''}`}
              onClick={() => props.onAspectLockedChange(!props.aspectLocked)}
              title={props.aspectLocked ? 'Aspect locked to crop' : 'Aspect unlocked, image will be contained'}
              aria-label="Toggle aspect ratio lock"
            >
              {props.aspectLocked ? <LinkIcon /> : <UnlinkIcon />}
            </button>
            <NumberField label="H" value={props.outputHeight} onChange={props.onHeightChange} />
          </div>

          {showFitControls && (
            <div className="seg-control" role="radiogroup" aria-label="Fit mode">
              {(['contain', 'cover', 'stretch'] as FitMode[]).map((m) => (
                <button
                  key={m}
                  role="radio"
                  aria-checked={props.fit === m}
                  className={`seg-btn${props.fit === m ? ' seg-btn--on' : ''}`}
                  onClick={() => props.onFitChange(m)}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          )}

          {showBgControls && (
            <BackgroundPicker
              bg={props.bg}
              customColor={props.customColor}
              transparentDisabled={transparentDisabled}
              onBgChange={props.onBgChange}
              onCustomColorChange={props.onCustomColorChange}
            />
          )}

          <PreviewTile
            source={props.source}
            crop={props.crop}
            outputWidth={props.outputWidth}
            outputHeight={props.outputHeight}
            rotation={props.rotation}
            flipH={props.flipH}
            flipV={props.flipV}
            fit={props.fit}
            bg={transparentDisabled && props.bg === 'transparent' ? '#ffffff' : props.bg}
            format={props.format}
            theme={props.theme}
          />
        </Group>

        <Group title="Format">
          <select
            value={props.format}
            onChange={(e) => props.onFormatChange(e.target.value as OutputFormat)}
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
          {props.format !== 'png' && (
            <div className="quality-row">
              <div className="quality-row__head">
                <span className="micro-label">Quality</span>
                <span className="mono">{props.quality}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={props.quality}
                onChange={(e) => props.onQualityChange(Number(e.target.value))}
              />
            </div>
          )}
          {props.format === 'avif' && (
            <p className="caveat">AVIF needs Chrome / Safari · falls back to WebP elsewhere</p>
          )}
          {transparentDisabled && props.bg === 'transparent' && showBgControls && (
            <p className="caveat">JPEG can't be transparent, using white background</p>
          )}
        </Group>

        {!props.isBatch && (
          <Group title="Filename">
            <input
              type="text"
              placeholder="mountain landscape sunset"
              value={props.filenameInput}
              onChange={(e) => props.onFilenameChange(e.target.value)}
            />
            <div className="slug-out mono" title={previewName}>
              {previewName}
            </div>
          </Group>
        )}
        {props.isBatch && (
          <Group title="Filename">
            <p className="caveat">Each image has its own filename in the sidebar.</p>
          </Group>
        )}
      </div>

      <div className="inspector__footer">
        <button className="primary-btn" disabled={props.busy} onClick={props.onExport}>
          <DownloadIcon />
          <span>
            {props.busy
              ? 'Exporting…'
              : props.isBatch
                ? `Export ${props.batchCount} images (.zip)`
                : 'Export image'}
          </span>
        </button>
      </div>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="group">
      <div className="group__title">{title}</div>
      <div className="group__body">{children}</div>
    </section>
  );
}

function Stat({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value mono">
        {value}
        {unit && <span className="stat__unit"> {unit}</span>}
      </span>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="num-field">
      <span className="num-field__label">{label}</span>
      <input
        type="number"
        min={1}
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

interface BgPickerProps {
  bg: BgColor;
  customColor: string;
  transparentDisabled: boolean;
  onBgChange: (b: BgColor) => void;
  onCustomColorChange: (hex: string) => void;
}

const PRESETS: Array<{ label: string; value: BgColor; modifier: string }> = [
  { label: 'Transparent', value: 'transparent', modifier: 'transparent' },
  { label: 'White', value: '#ffffff', modifier: 'white' },
  { label: 'Black', value: '#000000', modifier: 'black' },
];

function BackgroundPicker({
  bg,
  customColor,
  transparentDisabled,
  onBgChange,
  onCustomColorChange,
}: BgPickerProps) {
  const isPreset = PRESETS.some((p) => p.value === bg);
  const customActive = !isPreset || bg === customColor;
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [draftHex, setDraftHex] = useState(bg === 'transparent' ? customColor : bg);
  const [hexValid, setHexValid] = useState(true);

  // Keep the draft in sync when the bg changes externally
  useEffect(() => {
    if (bg !== 'transparent') {
      setDraftHex(bg);
      setHexValid(true);
    }
  }, [bg]);

  function activateCustom() {
    onBgChange(customColor);
    // Defer the click so React commits state first.
    requestAnimationFrame(() => colorInputRef.current?.click());
  }

  function commitInput(value: string) {
    setDraftHex(value);
    const parsed = parseColor(value);
    if (parsed) {
      setHexValid(true);
      onCustomColorChange(parsed);
      onBgChange(parsed);
    } else {
      setHexValid(false);
    }
  }

  const activeColorForReadout = bg === 'transparent' ? customColor : bg;

  return (
    <div className="bg-block">
      <div className="bg-row">
        <span className="micro-label">Background</span>
        <div className="bg-swatches">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              className={`bg-swatch bg-swatch--${p.modifier}${bg === p.value ? ' bg-swatch--on' : ''}`}
              onClick={() => onBgChange(p.value)}
              disabled={p.value === 'transparent' && transparentDisabled}
              title={p.label}
              aria-label={p.label}
              aria-pressed={bg === p.value}
            />
          ))}
          <button
            className={`bg-swatch bg-swatch--custom${customActive && bg !== 'transparent' && !PRESETS.slice(1).some((p) => p.value === bg) ? ' bg-swatch--on' : ''}`}
            onClick={activateCustom}
            title="Custom color, click to open color picker"
            aria-label="Custom color"
            style={{ background: customColor }}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={customColor}
            onChange={(e) => {
              const v = e.target.value.toLowerCase();
              onCustomColorChange(v);
              onBgChange(v);
            }}
            className="hidden-color-input"
            tabIndex={-1}
            aria-hidden
          />
        </div>
      </div>

      <div className="hex-row">
        <span
          className="hex-row__chip"
          style={{ background: bg === 'transparent' ? undefined : bg }}
          aria-hidden
        />
        <input
          type="text"
          className={`hex-input mono${hexValid ? '' : ' hex-input--invalid'}`}
          value={draftHex}
          spellCheck={false}
          onChange={(e) => commitInput(e.target.value)}
          onBlur={() => {
            if (!hexValid) {
              setDraftHex(activeColorForReadout);
              setHexValid(true);
            }
          }}
          placeholder="#ffffff"
          aria-label="Color value (hex, rgb, or hsl)"
        />
      </div>

      <div className="color-readout">
        <span className="color-readout__row">
          <span className="color-readout__label">RGB</span>
          <span className="mono">{formatRgb(activeColorForReadout)}</span>
        </span>
        <span className="color-readout__row">
          <span className="color-readout__label">HSL</span>
          <span className="mono">{formatHsl(activeColorForReadout)}</span>
        </span>
      </div>
    </div>
  );
}
