import { NextResponse, type NextRequest } from 'next/server';

import { readUnsubscribe, setNotification } from '@/lib/unsubscribe';

/**
 * Where mail apps' own Unsubscribe button posts (RFC 8058): turns that kind of
 * email off at once, with no page to see.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const link = readUnsubscribe(
    searchParams.get('u'),
    searchParams.get('k'),
    searchParams.get('t')
  );
  if (!link) return new NextResponse(null, { status: 400 });

  await setNotification(link.userId, link.kind, false);
  return new NextResponse(null, { status: 204 });
}
