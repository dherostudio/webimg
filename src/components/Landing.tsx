import { useRef, useState, type MouseEvent } from 'react';
import type { Theme } from '../useTheme';
import { AppIcon } from './AppIcon';
import { DropZone } from './DropZone';
import { LottieIcon } from './LottieIcon';
import '../Landing.css';

interface Props {
  onFiles: (files: File[]) => void;
  theme: Theme;
}

const GITHUB_URL = 'https://github.com/dherostudio/webimg';
const STUDIO_URL = 'https://dhero.studio';

/** Tracks the cursor inside a card and exposes it to CSS as --mx / --my. */
function handleMagicMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: '/icons/crop-straighten.json',
    title: 'Crop & straighten',
    desc: 'Crop to any aspect ratio with drag handles and rule-of-thirds guides. Rotate in 90° steps and flip horizontally or vertically.',
  },
  {
    icon: '/icons/resize-to-exact-dimensions.json',
    title: 'Resize to exact dimensions',
    desc: 'Set a precise pixel width and height, with an optional aspect-ratio lock so images never look stretched or squashed.',
  },
  {
    icon: '/icons/convert.json',
    title: 'Convert WebP, AVIF, PNG & JPEG',
    desc: 'Convert images between modern and classic formats. WebP and AVIF keep files small; PNG and JPEG keep them universal.',
  },
  {
    icon: '/icons/compress-live-preview.json',
    title: 'Compress with live preview',
    desc: 'Dial in quality with a slider and watch the estimated file size update instantly. Smaller images mean faster page loads.',
  },
  {
    icon: '/icons/batch-processing.json',
    title: 'Batch processing',
    desc: 'Edit dozens of images in one session and export them all as a single ZIP, each with its own filename.',
  },
  {
    icon: '/icons/private.json',
    title: '100% private, nothing uploaded',
    desc: 'There is no server. Every crop, resize, and conversion happens locally, so your images never leave your device.',
  },
];

const STEPS: { icon: string; title: string; desc: string }[] = [
  {
    icon: '/icons/drop-image.json',
    title: 'Drop your images',
    desc: 'Drag in one image or a whole batch, or click to browse. webimg opens JPEG, PNG, WebP, AVIF, GIF, and BMP files.',
  },
  {
    icon: '/icons/edit-and-adjust.json',
    title: 'Edit and adjust',
    desc: 'Crop, resize, rotate, flip, pick an output format, and set the quality. The live preview updates as you work.',
  },
  {
    icon: '/icons/export.json',
    title: 'Export',
    desc: 'Download a single optimised image, or a ZIP of the whole batch. No sign-up, no waiting, no watermark.',
  },
];

const WHY: { title: string; desc: string }[] = [
  {
    title: 'More than compression',
    desc: 'Most online image tools only shrink files. webimg is a complete editor with cropping, resizing, rotation, and flipping built in.',
  },
  {
    title: 'Real batch exports',
    desc: 'Process many images at once and download them as a single ZIP with per-image filenames, instead of one file at a time.',
  },
  {
    title: 'Truly private',
    desc: 'Unlike tools that upload to a server, webimg processes everything in your browser. Your images stay on your device.',
  },
  {
    title: 'Free, with no account',
    desc: 'No sign-up, no subscription, no watermark, and no upload limits. Open the page and start editing right away.',
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is webimg free?',
    a: 'Yes. webimg is completely free to use. There are no accounts, no subscriptions, no watermarks, and no limit on how many images you can edit.',
  },
  {
    q: 'Does webimg upload my images?',
    a: 'No. webimg runs entirely in your browser. There is no server, so your images are never uploaded and never leave your device.',
  },
  {
    q: 'What image formats does webimg support?',
    a: 'You can open JPEG, PNG, WebP, AVIF, GIF, and BMP files, and export to WebP, AVIF, PNG, or JPEG.',
  },
  {
    q: 'Can I convert images to WebP or AVIF?',
    a: 'Yes. webimg converts images to WebP, AVIF, PNG, or JPEG. WebP and AVIF produce much smaller files, which is ideal for fast-loading websites.',
  },
  {
    q: 'Can I crop and resize images?',
    a: 'Yes. webimg is a full editor: crop to any aspect ratio, resize to exact pixel dimensions with an aspect-ratio lock, and rotate or flip the image.',
  },
  {
    q: 'Can I edit multiple images at once?',
    a: 'Yes. Drop several images and webimg switches to batch mode. Edit each one, then export them all together as a single ZIP file.',
  },
  {
    q: 'Does webimg compress images?',
    a: 'Yes. A quality slider with a live file-size estimate lets you compress images as much as you need while keeping the quality you want.',
  },
  {
    q: 'Is webimg a good alternative to TinyPNG or Squoosh?',
    a: 'webimg covers the same compression and format conversion those tools offer, and adds full editing (crop, resize, rotate, flip) plus true batch export with per-image filenames. Like Squoosh, it works entirely client-side, so nothing is uploaded.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. webimg runs in any modern web browser. There is nothing to download or install.',
  },
  {
    q: 'Does webimg work offline?',
    a: 'Yes. Once the page has loaded, all editing happens locally, so webimg keeps working even without an internet connection.',
  },
];

export function Landing({ onFiles, theme }: Props) {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  /** Tracks the cursor across the footer and feeds it to the wordmark glow. */
  function handleFooterGlow(e: MouseEvent<HTMLElement>) {
    const el = wordmarkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <div className="landing">
      <section className="landing__hero">
        <div className="hero-badges">
        <a
          className="ph-badge"
          href="https://www.producthunt.com/products/webimg?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-webimg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            width={250}
            height={54}
            alt="webimg - A private, batch image editor that runs in your browser. | Product Hunt"
            src={
              theme === 'dark'
                ? 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1164181&theme=dark&t=1780655317153'
                : 'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1164181&theme=neutral&t=1780655492774'
            }
          />
        </a>
        <a
          className="launchbuff-badge"
          href="https://launchbuff.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Featured on LaunchBuff"
        >
          <img
            width={256}
            height={80}
            alt="Featured on LaunchBuff"
            src={
              theme === 'dark'
                ? '/launchbuff-featured-dark.svg'
                : '/launchbuff-featured-light.svg'
            }
          />
        </a>
        </div>
        <p className="landing__hero-eyebrow">Private by design</p>
        <h1 className="landing__title">
          Crop, resize, convert, and compress images in your browser
        </h1>
        <p className="landing__subtitle">
          webimg is a free, private image editor that runs entirely in your browser.
          Convert between WebP, AVIF, PNG, and JPEG and edit images in batches, without
          uploading a single file.
        </p>
        <DropZone onFiles={onFiles} />
        <p className="landing__trust">
          Free · No sign-up · Nothing uploaded · No watermarks
        </p>
      </section>

      <section id="features" className="landing__section landing__features">
        <div className="landing__section-head">
          <p className="landing__eyebrow">Features</p>
          <h2 className="landing__section-title">
            Everything a modern image editor should do
          </h2>
        </div>
        <div className="landing__feature-grid">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="feature-card glass magic-card"
              onMouseMove={handleMagicMove}
            >
              <div className="feature-card__icon">
                <LottieIcon src={f.icon} theme={theme} size={44} />
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="landing__section landing__how">
        <div className="landing__section-head">
          <p className="landing__eyebrow">How it works</p>
          <h2 className="landing__section-title">How to edit an image with webimg</h2>
        </div>
        <div className="landing__steps">
          {STEPS.map(({ icon, title, desc }) => (
            <article
              key={title}
              className="step-card glass magic-card"
              onMouseMove={handleMagicMove}
            >
              <div className="step-card__icon">
                <LottieIcon src={icon} theme={theme} size={44} />
              </div>
              <h3 className="step-card__title">{title}</h3>
              <p className="step-card__desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing__section landing__why">
        <div className="landing__section-head">
          <p className="landing__eyebrow">Why webimg</p>
          <h2 className="landing__section-title">A full editor, not just a compressor</h2>
          <p className="landing__section-lead">
            Online image tools usually do one thing. webimg combines editing, format
            conversion, compression, and batch export in a single private workspace.
          </p>
        </div>
        <div className="landing__why-grid">
          {WHY.map((w) => (
            <article
              key={w.title}
              className="why-point glass magic-card"
              onMouseMove={handleMagicMove}
            >
              <div className="why-point__icon">
                <LottieIcon src="/icons/check-sign.json" theme={theme} size={40} />
              </div>
              <div className="why-point__body">
                <h3 className="why-point__title">{w.title}</h3>
                <p className="why-point__desc">{w.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="landing__section landing__faq">
        <div className="landing__section-head">
          <p className="landing__eyebrow">FAQ</p>
          <h2 className="landing__section-title">Frequently asked questions</h2>
        </div>
        <div className="landing__faq-list">
          {FAQS.map((item) => (
            <details
              key={item.q}
              open={openFaq === item.q}
              className="faq-item glass magic-card"
              onMouseMove={handleMagicMove}
            >
              <summary
                onClick={(e) => {
                  // Drive open state in React so the previously-open panel
                  // animates closed instead of snapping shut.
                  e.preventDefault();
                  setOpenFaq((cur) => (cur === item.q ? null : item.q));
                }}
              >
                {item.q}
              </summary>
              <div className="faq-item__content">
                <div className="faq-item__inner">
                  <p className="faq-item__body">{item.a}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className="landing__footer" onMouseMove={handleFooterGlow}>
        <div className="footer-card glass">
          <div className="footer-card__top">
            <div className="footer-brand">
              <div className="footer-brand__id">
                <AppIcon size={32} />
                <span className="footer-brand__name">webimg</span>
              </div>
              <p className="footer-brand__desc">
                webimg is a free, private, browser-based image editor for cropping,
                resizing, converting, and compressing images. Nothing is ever uploaded.
              </p>
            </div>

            <nav className="footer-nav" aria-label="Footer">
              <div className="footer-col">
                <p className="footer-col__title">Sections</p>
                <a className="footer-link" href="#features">
                  Features
                </a>
                <a className="footer-link" href="#how-it-works">
                  How it works
                </a>
                <a className="footer-link" href="#faq">
                  FAQ
                </a>
              </div>
              <div className="footer-col">
                <p className="footer-col__title">Project</p>
                <a
                  className="footer-link"
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub
                </a>
                <a
                  className="footer-link"
                  href={`${GITHUB_URL}/issues`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Report an issue
                </a>
                <a
                  className="footer-link"
                  href={`${GITHUB_URL}#privacy`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Privacy
                </a>
              </div>
            </nav>
          </div>

          <div className="footer-card__divider" />

          <div className="footer-card__bottom">
            <p className="footer-copyright">© 2026 webimg. All rights reserved.</p>
            <p className="footer-built">
              Built by{' '}
              <a
                className="footer-built__link"
                href={STUDIO_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                dhero.studio
              </a>
            </p>
          </div>

          <div ref={wordmarkRef} className="footer-wordmark" aria-hidden="true">
            webimg
          </div>
        </div>
      </footer>
    </div>
  );
}
