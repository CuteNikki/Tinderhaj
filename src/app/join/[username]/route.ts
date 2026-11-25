import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

import { INVITE_COOKIE, INVITE_MAX_AGE } from '@/constants/invites';

import { isBanned } from '@/lib/bans';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';

/**
 * An invite link: remembers who sent it, for when they sign up (see auth's
 * user hook), and goes on to the home page to see what Tinderhaj is. A link
 * from an account that's gone or banned goes there all the same.
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteContext<'/join/[username]'>
) {
  const { username } = await params;
  const inviter = await prisma.user.findUnique({
    where: { username: decodeURIComponent(username) },
    select: { id: true, banned: true, banExpires: true },
  });

  if (inviter && !isBanned(inviter))
    (await cookies()).set(INVITE_COOKIE, inviter.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: siteURL.protocol === 'https:',
      path: '/',
      maxAge: INVITE_MAX_AGE,
    });

  return NextResponse.redirect(new URL('/', siteURL));
}
