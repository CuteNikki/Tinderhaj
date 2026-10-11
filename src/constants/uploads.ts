export const MAX_AVATAR_SIZE_MB = 4;
export const MAX_BANNER_SIZE_MB = 8;

/**
 * Where UploadThing keeps uploads: `<app id>.ufs.sh`, or `utfs.io` for older
 * ones. Pictures from anywhere else are turned away, so nobody's browser (nor
 * the server, drawing shared images) loads them from a stranger's server.
 */
export const UPLOAD_HOSTNAME = /^([a-z0-9]+\.ufs\.sh|utfs\.io)$/;

/** Whether `url` is an upload of ours, over https. */
export function isUploadUrl(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && UPLOAD_HOSTNAME.test(hostname);
  } catch {
    return false;
  }
}
