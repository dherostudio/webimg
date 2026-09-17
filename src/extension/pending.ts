/**
 * When the service worker opens the editor from the "Edit image in webimg"
 * context menu, it passes the image URL as ?src=. The editor page fetches it
 * directly (the worker already requested permission for that origin) and
 * hands it to the app as a File. No chrome.* APIs are needed here, so this
 * stays plain web code.
 */

function filenameFromUrl(src: string, mime: string): string {
  let base = 'image';
  try {
    const u = new URL(src);
    if (u.protocol !== 'data:') {
      const last = decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() ?? '');
      if (last) base = last;
    }
  } catch {
    // keep default
  }
  if (/\.[a-z0-9]{2,5}$/i.test(base)) return base;
  const ext = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'png';
  return `${base}.${ext}`;
}

export async function loadPendingImage(): Promise<File[]> {
  const src = new URLSearchParams(window.location.search).get('src');
  if (!src) return [];

  let res: Response;
  try {
    res = await fetch(src, { credentials: 'include' });
  } catch {
    throw new Error(
      'Could not fetch the image. Allow webimg to access this site when Chrome asks, then try again.'
    );
  }
  if (!res.ok) throw new Error(`Could not fetch the image (HTTP ${res.status})`);

  const blob = await res.blob();
  if (blob.type && !blob.type.startsWith('image/')) {
    throw new Error('That link is not an image');
  }
  const type = blob.type || 'image/png';
  return [new File([blob], filenameFromUrl(src, type), { type })];
}
