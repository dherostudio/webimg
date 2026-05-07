import type { Rotation } from '../types';
import { FlipHIcon, FlipVIcon, ResetIcon, RotateLeftIcon, RotateRightIcon } from './icons';

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
        <RotateLeftIcon />
      </ToolButton>
      <ToolButton
        label="Rotate right"
        onClick={() => onRotateChange(((rotation + 90) % 360) as Rotation)}
      >
        <RotateRightIcon />
      </ToolButton>
      <div className="toolbar__divider" />
      <ToolButton label="Flip horizontal" active={flipH} onClick={() => onFlipHChange(!flipH)}>
        <FlipHIcon />
      </ToolButton>
      <ToolButton label="Flip vertical" active={flipV} onClick={() => onFlipVChange(!flipV)}>
        <FlipVIcon />
      </ToolButton>
      <div className="toolbar__divider" />
      <ToolButton label="Reset transform" onClick={onResetTransform}>
        <ResetIcon />
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
