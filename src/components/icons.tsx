interface IconProps {
  size?: number;
  className?: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const RotateLeftIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M3 6h6a4 4 0 0 1 0 8H6" />
    <path {...stroke} d="M5 4 3 6l2 2" />
  </svg>
);

export const RotateRightIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M13 6H7a4 4 0 0 0 0 8h3" />
    <path {...stroke} d="m11 4 2 2-2 2" />
  </svg>
);

export const FlipHIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M8 1v14" strokeDasharray="2 2" />
    <path {...stroke} d="M2 5l4-2v10l-4-2z" />
    <path {...stroke} d="M14 5l-4-2v10l4-2z" />
  </svg>
);

export const FlipVIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M1 8h14" strokeDasharray="2 2" />
    <path {...stroke} d="M5 2l-2 4h10l-2-4z" />
    <path {...stroke} d="M5 14l-2-4h10l-2 4z" />
  </svg>
);

export const ZoomInIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle {...stroke} cx="7" cy="7" r="5" />
    <path {...stroke} d="M14 14l-3.5-3.5M4.5 7H9.5M7 4.5V9.5" />
  </svg>
);

export const ZoomOutIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle {...stroke} cx="7" cy="7" r="5" />
    <path {...stroke} d="M14 14l-3.5-3.5M4.5 7H9.5" />
  </svg>
);

export const FitIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3" />
  </svg>
);

export const LinkIcon = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M6 10a3 3 0 0 0 4 0l3-3a3 3 0 0 0-4-4L8 4" />
    <path {...stroke} d="M10 6a3 3 0 0 0-4 0l-3 3a3 3 0 0 0 4 4l1-1" />
  </svg>
);

export const UnlinkIcon = ({ size = 14, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M6 10a3 3 0 0 0 1.5.8M13 7a3 3 0 0 0-4-4L8 4" />
    <path {...stroke} d="M3 9a3 3 0 0 0 4 4l1-1M10 6a3 3 0 0 0-1.5-.8" />
    <path {...stroke} d="M2 14L14 2" />
  </svg>
);

export const ResetIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M3 8a5 5 0 1 0 1.5-3.5" />
    <path {...stroke} d="M3 2v3h3" />
  </svg>
);

export const DownloadIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M8 2v9M4 7l4 4 4-4M2 14h12" />
  </svg>
);

export const FolderIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M2 4a1 1 0 0 1 1-1h3.5l1.5 1.5H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
  </svg>
);

export const PlusIcon = ({ size = 22, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path {...stroke} d="M12 5v14M5 12h14" />
  </svg>
);

export const SunIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <circle {...stroke} cx="8" cy="8" r="3" />
    <path {...stroke} d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.6 3.4l-1 1M5.4 10.6l-1 1M12.6 12.6l-1-1M5.4 5.4l-1-1" />
  </svg>
);

export const MoonIcon = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" className={className}>
    <path {...stroke} d="M13.5 9.3A6 6 0 0 1 6.7 2.5a6 6 0 1 0 6.8 6.8z" />
  </svg>
);
