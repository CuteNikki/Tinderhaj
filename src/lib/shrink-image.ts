/**
 * How a picture is shown at its largest, as the box it's cropped to fill:
 * `width` across, at `aspect` (width / height), in pixels enough for sharp
 * screens. Nothing bigger is ever shown, so nothing bigger is kept.
 */
export const IMAGE_BOXES = {
  avatar: { width: 512, aspect: 1 },
  banner: { width: 1600, aspect: 5 / 2 },
} as const;

/** The pictures that can be uploaded (see the upload routes), all of which a canvas can redraw. Anything else is left as it is. */
const REDRAWABLE = /^image\/(jpeg|png|webp|avif)$/;

/**
 * A picture made no bigger than it's ever shown, and a WebP, in the browser
 * before it's uploaded: a phone photo of several MB becomes tens of KB, and
 * every page showing it loads that much less. Scaled so it still fills
 * `box` once cropped to it (see ProfileBanner's object-cover). Whatever comes
 * out smaller, this or the original, is the one kept.
 */
export async function shrinkImage(file: File, box: { width: number; aspect: number }): Promise<File> {
  if (!REDRAWABLE.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    // Enough of it to fill the box either way round: by its width, or its height for one wider than the box
    const scale = Math.min(1, Math.max(box.width / bitmap.width, box.width / box.aspect / bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
    // A browser that can't write WebP hands back a PNG instead, often bigger than what was chosen
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp', lastModified: Date.now() });
  } catch {
    // Whatever went wrong, the original still uploads
    return file;
  }
}
