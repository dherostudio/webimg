import { FitIcon, ZoomInIcon, ZoomOutIcon } from './icons';

interface Props {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onActualSize: () => void;
}

export function ZoomHud({ zoom, onZoomIn, onZoomOut, onFit, onActualSize }: Props) {
  const pct = Math.round(zoom * 100);
  return (
    <div className="zoom-hud glass">
      <button className="hud-btn" onClick={onZoomOut} title="Zoom out" aria-label="Zoom out">
        <ZoomOutIcon />
      </button>
      <button
        className="zoom-hud__pct"
        onClick={onActualSize}
        title="Actual size (100%)"
      >
        {pct}%
      </button>
      <button className="hud-btn" onClick={onZoomIn} title="Zoom in" aria-label="Zoom in">
        <ZoomInIcon />
      </button>
      <div className="zoom-hud__divider" />
      <button className="hud-btn hud-btn--text" onClick={onFit} title="Fit to view">
        <FitIcon />
        <span>Fit</span>
      </button>
    </div>
  );
}
