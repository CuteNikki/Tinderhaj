export const MAX_AVATAR_SIZE_MB = 4;
export const MAX_BANNER_SIZE_MB = 8;

/** The pictures a shark has, each with its size limit in MB. */
export const UPLOAD_KINDS = { avatar: MAX_AVATAR_SIZE_MB, banner: MAX_BANNER_SIZE_MB } as const;
export type UploadKind = keyof typeof UPLOAD_KINDS;

/**
 * Still pictures only, the kinds the browser shrinks to size before sending
 * (see shrinkImage), each with the extension it's kept under: no GIFs, which
 * would move and couldn't be shrunk, and no SVGs.
 */
export const UPLOAD_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' } as const;

/** Where uploads are kept and served from: our own storage (see the README's Pictures section). */
export const UPLOAD_ORIGIN = 'https://images.tinderhaj.com';

/**
 * Where uploads are. Pictures from anywhere else are turned away, so nobody's
 * browser (nor the server, drawing shared images) loads them from a
 * stranger's server.
 */
export const UPLOAD_HOSTNAME = /^images\.tinderhaj\.com$/;

/** Whether `url` is an upload of ours, over https. */
export function isUploadUrl(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && UPLOAD_HOSTNAME.test(hostname);
  } catch {
    return false;
  }
}
