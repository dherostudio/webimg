export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export type Rotation = 0 | 90 | 180 | 270;

export type FitMode = 'contain' | 'cover' | 'stretch';

/**
 * Background color: 'transparent' or any hex string like '#ff0000'.
 * The custom color picker accepts hex / rgb() / hsl() but stores as canonical hex.
 */
export type BgColor = string;

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Crop expressed as fractions 0..1 of the source image dimensions. */
export interface CropFrac {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface BatchItem {
  id: string;
  source: HTMLImageElement;
  originalFilename: string;
  customFilename: string;
  thumbnailUrl: string;
}

export interface EditorState {
  source: HTMLImageElement;
  sourceFilename: string;
  crop: CropRect;
  outputWidth: number;
  outputHeight: number;
  aspectLocked: boolean;
  rotation: Rotation;
  flipH: boolean;
  flipV: boolean;
  format: OutputFormat;
  quality: number;
  filenameInput: string;
}
