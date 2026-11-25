import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { isRevalidateSignature } from '@/lib/revalidate-self';
import { SHARK_OF_THE_WEEK_TAG } from '@/lib/shark-of-the-week';

/** The tags the site may refresh this way. */
const TAGS = new Set([SHARK_OF_THE_WEEK_TAG]);

/**
 * Refreshes a tag for the site's own work outside a request (see
 * revalidateFromOutside), signed so nobody else can. What has it is drawn
 * again for the next visit, rather than shown stale.
 */
export async function POST(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag') ?? '';
  const given =
    request.headers.get('authorization')?.replace(/^Bearer /, '') ?? null;
  if (!TAGS.has(tag) || !isRevalidateSignature(tag, given))
    return new NextResponse(null, { status: 403 });

  revalidateTag(tag, { expire: 0 });
  return new NextResponse(null, { status: 204 });
}
