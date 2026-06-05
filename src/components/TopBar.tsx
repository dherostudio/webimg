import { FolderOpen, Moon, Sun } from 'lucide-react';
import type { Theme } from '../useTheme';
import { AppIcon } from './AppIcon';

interface Props {
  filename: string | null;
  width: number | null;
  height: number | null;
  theme: Theme;
  onToggleTheme: () => void;
  onLoadNew?: () => void;
  onHome: () => void;
}

export function TopBar({
  filename,
  width,
  height,
  theme,
  onToggleTheme,
  onLoadNew,
  onHome,
}: Props) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={onHome} aria-label="Home">
        <AppIcon size={40} />
      </button>

      <div className="topbar__right">
        {filename && (
          <div className="filemeta glass">
            <span className="filemeta__name" title={filename}>
              {filename}
            </span>
            {width && height && (
              <span className="filemeta__dims mono">
                {width} × {height}
              </span>
            )}
            {onLoadNew && (
              <button className="ghost-btn ghost-btn--compact" onClick={onLoadNew}>
                <FolderOpen size={14} />
                <span>Open…</span>
              </button>
            )}
          </div>
        )}

        <button
          className="theme-toggle glass"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
