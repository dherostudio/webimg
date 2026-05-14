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

export const GithubIcon = ({ size = 16, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
