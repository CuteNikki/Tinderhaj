import 'server-only';

import { AwsClient } from 'aws4fetch';
import { after } from 'next/server';

import { UPLOAD_ORIGIN } from '@/constants/uploads';
import prisma from '@/lib/prisma';

/**
 * The site's own bucket, which images.tinderhaj.com serves, and Garage's S3
 * API for every site, which takes the bucket in the path (see the README's
 * Pictures section).
 */
const BUCKET = 'tinderhaj';
const STORAGE_ENDPOINT = 'https://s3.niso.moe';

/** Where storage's S3 API takes the picture at `path`. */
function apiUrl(path: string) {
  return new URL(`/${BUCKET}${path}`, STORAGE_ENDPOINT);
}

/** How long a link to upload to lasts: plenty to send one shrunk picture, too short to keep. */
const UPLOAD_LINK_SECONDS = 300;

/** Our storage, as its S3 API takes requests: signed with the site's key (STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY). */
function storage() {
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) throw new Error('STORAGE_ACCESS_KEY_ID and STORAGE_SECRET_ACCESS_KEY must be set for uploads');
  return new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: process.env.STORAGE_REGION || 'garage', retries: 1 });
}

/**
 * A link for the browser to upload one picture to, straight to storage rather
 * than through the site, whose host turns away requests that big. It's signed
 * for exactly this type and size, so nothing else can be sent with it, and for
 * a few minutes. `url` is where the picture is seen once it's there.
 */
export async function signUpload(path: string, type: string, size: number) {
  const url = new URL(path, UPLOAD_ORIGIN);
  const upload = apiUrl(url.pathname);
  upload.searchParams.set('X-Amz-Expires', String(UPLOAD_LINK_SECONDS));
  const signed = await storage().sign(upload.href, {
    method: 'PUT',
    headers: { 'content-type': type, 'content-length': String(size) },
    aws: { signQuery: true, allHeaders: true },
  });
  return { uploadUrl: signed.url, url: url.href };
}

/**
 * A picture as requestUpload names them, and nothing else: a stored address
 * that only starts the same, with a query say, could ask storage for
 * something other than deleting it.
 */
const UPLOAD_PATH = /^\/(avatars|banners)\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/;

/**
 * Deletes pictures nothing shows any more, once the response has gone: the
 * one a shark had before a new one, or a deleted shark's or account's. Only
 * ours, and only once no shark has it, since any picture of ours can be saved
 * on any shark. Best effort: one left behind only takes up space.
 */
export function deleteUploadsLater(urls: (string | null | undefined)[]) {
  const ours = [...new Set(urls)].filter((url): url is string => {
    if (!url?.startsWith(`${UPLOAD_ORIGIN}/`)) return false;
    const { pathname, search, hash } = new URL(url);
    return UPLOAD_PATH.test(pathname) && !search && !hash;
  });
  if (!ours.length) return;

  after(async () => {
    for (const url of ours) {
      try {
        if (await prisma.profile.count({ where: { OR: [{ avatarUrl: url }, { bannerUrl: url }] } })) continue;
        const response = await storage().fetch(apiUrl(new URL(url).pathname), { method: 'DELETE', signal: AbortSignal.timeout(8000) });
        if (!response.ok) console.error(`Failed to delete ${url}: ${response.status}`);
      } catch (error) {
        console.error(`Failed to delete ${url}`, error);
      }
    }
  });
}
