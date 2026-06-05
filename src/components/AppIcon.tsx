interface Props {
  size?: number;
  className?: string;
}

/** webimg app icon — CSS squircle plate holding the webimg logomark.
 * The mark uses currentColor so it inherits the theme-aware plate color. */
export function AppIcon({ size = 28, className }: Props) {
  return (
    <span
      className={`app-icon${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size }}
      aria-label="webimg"
      role="img"
    >
      <svg
        className="app-icon__glyph"
        viewBox="0 0 30 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M21.3708 0.812522C21.9057 0.270996 22.5471 0 23.2949 0C24.043 0 24.6816 0.265637 25.2114 0.79691C25.7412 1.32815 26.0059 1.96878 26.0059 2.7188C26.0059 3.50007 25.7385 4.16415 25.2036 4.71103C24.6687 5.25792 24.022 5.53135 23.2636 5.53135C22.5264 5.53135 21.8928 5.26326 21.363 4.72663C20.8332 4.19026 20.5683 3.54183 20.5683 2.7813C20.5683 2.01054 20.8359 1.3543 21.3708 0.812522Z"
        />
        <path fill="currentColor" d="M25.4278 19.1103V6.99985H29.791L25.4278 19.1103Z" />
        <path
          fill="currentColor"
          d="M4.41264 6.99985L7.83524 16.5625L11.4464 6.99985H14.0011L17.6789 16.6723L21.097 6.99985H21.1621V24H16.4754L12.7416 14.3123L9.11598 24H6.41289L0.209926 6.99985H4.41264Z"
        />
      </svg>
      <span className="app-icon__shine" aria-hidden />
    </span>
  );
}
