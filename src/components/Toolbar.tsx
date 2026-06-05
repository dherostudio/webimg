import {
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCcwSquare,
  RotateCwSquare,
} from 'lucide-react';
import type { Rotation } from '../types';

interface Props {
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  onRotateChange: (r: Rotation) => void;
  onFlipHChange: (v: boolean) => void;
  onFlipVChange: (v: boolean) => void;
  onResetTransform: () => void;
}

export function Toolbar({
  rotation,
  flipH,
  flipV,
  onRotateChange,
  onFlipHChange,
  onFlipVChange,
  onResetTransform,
}: Props) {
  return (
    <div className="toolbar glass">
      <ToolButton
        label="Rotate left"
        onClick={() => onRotateChange(((rotation + 270) % 360) as Rotation)}
      >
        <RotateCcwSquare size={16} />
      </ToolButton>
      <ToolButton
        label="Rotate right"
        onClick={() => onRotateChange(((rotation + 90) % 360) as Rotation)}
      >
        <RotateCwSquare size={16} />
      </ToolButton>
      <div className="toolbar__divider" />
      <ToolButton label="Flip horizontal" active={flipH} onClick={() => onFlipHChange(!flipH)}>
        <FlipHorizontal2 size={16} />
      </ToolButton>
      <ToolButton label="Flip vertical" active={flipV} onClick={() => onFlipVChange(!flipV)}>
        <FlipVertical2 size={16} />
      </ToolButton>
      <div className="toolbar__divider" />
      <ToolButton label="Reset transform" onClick={onResetTransform}>
        <RotateCcw size={16} />
      </ToolButton>
    </div>
  );
}

interface ToolButtonProps {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({ label, active, onClick, children }: ToolButtonProps) {
  return (
    <button
      className={`tool-btn${active ? ' tool-btn--active' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );
}
