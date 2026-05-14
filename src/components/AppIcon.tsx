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
        viewBox="0 0 377 326"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M73.1202 112.5H8.01055C2.03504 112.5 -1.83124 118.813 0.884454 124.136L101.331 321.011C104.089 326.417 111.626 326.904 115.056 321.898L153.719 265.481C155.398 263.033 155.582 259.856 154.198 257.23L80.198 116.771C78.8141 114.144 76.0893 112.5 73.1202 112.5Z"
        />
        <path
          fill="currentColor"
          d="M242.585 321.011L142.139 124.136C139.423 118.813 143.289 112.5 149.265 112.5H214.86C217.837 112.5 220.567 114.153 221.948 116.79L295.47 257.237C296.844 259.86 296.656 263.027 294.982 265.469L256.311 321.898C252.88 326.904 245.343 326.417 242.585 321.011Z"
        />
        <path
          fill="currentColor"
          d="M368.954 112.5H290.392C284.445 112.5 280.577 118.758 283.237 124.078L316.801 191.206C319.544 196.692 327.186 197.177 330.601 192.083L375.599 124.954C379.162 119.639 375.353 112.5 368.954 112.5Z"
        />
        <path
          fill="currentColor"
          d="M231.5 43C231.5 66.7482 212.248 86 188.5 86C164.752 86 145.5 66.7482 145.5 43C145.5 19.2518 164.752 0 188.5 0C212.248 0 231.5 19.2518 231.5 43Z"
        />
      </svg>
      <span className="app-icon__shine" aria-hidden />
    </span>
  );
}
