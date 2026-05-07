interface Props {
  size?: number;
  className?: string;
}

/**
 * "WI" app icon — squircle plate with a custom geometric monogram.
 *
 * The mark is drawn as SVG paths (not text) for crisp rendering at any size:
 *   - W: four-stroke chevron with sharp bevel joins
 *   - I: vertical stem with serif caps so it reads as a letter, not a divider
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
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* W — four-stroke zigzag */}
        <path
          d="M 8 20 L 17 44 L 25 30 L 33 44 L 42 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="bevel"
        />
        {/* I — vertical stem */}
        <rect x="49" y="20" width="7" height="24" fill="currentColor" />
        {/* I serifs: top + bottom bars */}
        <rect x="46" y="20" width="13" height="3" fill="currentColor" />
        <rect x="46" y="41" width="13" height="3" fill="currentColor" />
      </svg>
      <span className="app-icon__shine" aria-hidden />
    </div>
  );
}
