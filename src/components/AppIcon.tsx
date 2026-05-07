interface Props {
  size?: number;
  className?: string;
}

/**
 * webimg app icon — squircle plate with geometric mark.
 * Mark uses currentColor so it inherits the theme.
 */
export function AppIcon({ size = 28, className }: Props) {
  return (
    <div
      className={`app-icon${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      aria-label="webimg"
      role="img"
    >
      <svg
        className="app-icon__glyph"
        viewBox="0 0 256 256"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M256 64V128H192.5L160 95L128 64L96 95L63.5 128H64L128 192V256H64.5L32 223L0 192V64L64 0H192L256 64ZM256 192V256H192.5L160 223L128 192V128H192L256 192Z"
        />
      </svg>
      <span className="app-icon__shine" aria-hidden />
    </div>
  );
}
