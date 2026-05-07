import slugify from 'slugify';

export function toSlug(input: string): string {
  if (!input) return '';
  return slugify(input, {
    lower: true,
    strict: true,
    locale: 'en',
    trim: true,
  });
}

export function extensionFor(format: 'jpeg' | 'png' | 'webp' | 'avif'): string {
  return format === 'jpeg' ? 'jpg' : format;
}
