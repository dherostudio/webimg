/**
 * Generate a small thumbnail data URL from an HTMLImageElement.
 * Returns a data URL (base64 encoded JPEG) so it survives blob URL revocation.
 */
export async function makeThumbnail(source: HTMLImageElement, maxSize = 96): Promise<string> {
  const sw = source.naturalWidth;
  const sh = source.naturalHeight;
  const scale = Math.min(maxSize / sw, maxSize / sh, 1);
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);

  // Use JPEG for smallest size; thumbnails don't need transparency.
  return canvas.toDataURL('image/jpeg', 0.78);
}
