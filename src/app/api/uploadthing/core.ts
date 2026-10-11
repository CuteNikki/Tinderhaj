import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { MAX_AVATAR_SIZE_MB, MAX_BANNER_SIZE_MB } from '@/constants/uploads';
import { getSession } from '@/lib/session';

const f = createUploadthing();

/** A size limit as UploadThing takes it, like '4MB'. */
type FileSize = NonNullable<NonNullable<Exclude<Parameters<typeof f>[0], unknown[]>['image']>['maxFileSize']>;

async function requireSession() {
  const session = await getSession();

  if (!session) throw new UploadThingError('Unauthorized');

  return session;
}

/**
 * Still pictures only, the kinds the browser shrinks to size before sending
 * (see shrinkImage): no GIFs, which would move and couldn't be shrunk, and no
 * SVGs.
 */
function pictures(maxFileSize: FileSize) {
  const each = { maxFileSize, maxFileCount: 1 };
  return { 'image/jpeg': each, 'image/png': each, 'image/webp': each, 'image/avif': each };
}

export const ourFileRouter = {
  profileAvatar: f(pictures(`${MAX_AVATAR_SIZE_MB}MB`))
    .middleware(async () => ({ userId: (await requireSession()).user.id }))
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),

  profileBanner: f(pictures(`${MAX_BANNER_SIZE_MB}MB`))
    .middleware(async () => ({ userId: (await requireSession()).user.id }))
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
