import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { MAX_AVATAR_SIZE_MB, MAX_BANNER_SIZE_MB } from '@/constants/uploads';
import { getSession } from '@/lib/session';

const f = createUploadthing();

async function requireSession() {
  const session = await getSession();

  if (!session) throw new UploadThingError('Unauthorized');

  return session;
}

export const ourFileRouter = {
  profileAvatar: f({ image: { maxFileSize: `${MAX_AVATAR_SIZE_MB}MB`, maxFileCount: 1 } })
    .middleware(async () => ({ userId: (await requireSession()).user.id }))
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),

  profileBanner: f({ image: { maxFileSize: `${MAX_BANNER_SIZE_MB}MB`, maxFileCount: 1 } })
    .middleware(async () => ({ userId: (await requireSession()).user.id }))
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
