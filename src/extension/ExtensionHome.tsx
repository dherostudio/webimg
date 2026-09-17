import { MousePointerClick } from 'lucide-react';
import { DropZone } from '../components/DropZone';
import '../Landing.css';
import './ExtensionHome.css';

interface Props {
  onFiles: (files: File[]) => void;
}

/** Empty state for the extension. The website's landing page is marketing;
 * here the user has already installed the app, so it's just the drop zone
 * plus the one thing the extension adds: the right-click shortcut. */
export function ExtensionHome({ onFiles }: Props) {
  return (
    <div className="landing landing--extension">
      <section className="landing__hero landing__hero--extension">
        <p className="landing__hero-eyebrow">Private by design</p>
        <h1 className="landing__title">Crop, resize, convert, and compress images</h1>
        <p className="landing__subtitle">
          Everything runs on your device. Nothing is uploaded, ever.
        </p>
        <DropZone onFiles={onFiles} />
        <p className="landing__trust">Free · Nothing uploaded · Works offline</p>
        <p className="ext-tip glass">
          <MousePointerClick size={16} aria-hidden />
          <span>
            Right-click any image on a web page and choose{' '}
            <strong>Edit image in webimg</strong> to open it here.
          </span>
        </p>
        <p className="ext-footnote">
          <a href="https://webimg.app" target="_blank" rel="noreferrer noopener">
            webimg.app
          </a>
          <span aria-hidden> · </span>
          <a
            href="https://github.com/dherostudio/webimg"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open source
          </a>
        </p>
      </section>
    </div>
  );
}
