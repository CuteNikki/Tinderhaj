import { NextResponse, type NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { readUnsubscribe } from '@/lib/unsubscribe';

/**
 * Where mail apps' own Unsubscribe button posts (RFC 8058): turns the emails
 * about verified sharks off at once, with no page to see.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = readUnsubscribe(searchParams.get('u'), searchParams.get('t'));
  if (!userId) return new NextResponse(null, { status: 400 });

  await prisma.user.updateMany({
    where: { id: userId },
    data: { verifiedEmails: false },
  });
  return new NextResponse(null, { status: 204 });
}
