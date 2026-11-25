import 'server-only';

import { after } from 'next/server';

import { REPORT_REASONS } from '@/constants/reports';

import {
  sendBanLiftedEmail,
  sendBannedEmail,
  sendReportReceivedEmail,
  sendReportReviewedEmail,
  sendSharkUnverifiedEmail,
} from '@/lib/email';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';

/**
 * Emails about what moderators decided, once the response has gone: to the
 * account it was about, or the one who reported. Always, as each is the
 * answer to something, but only to a confirmed address, so a typo doesn't
 * reach a stranger. A failed send is only logged: the decision stands.
 */
function later(what: string, send: () => Promise<void>) {
  after(async () => {
    try {
      await send();
    } catch (error) {
      console.error(`Failed to email ${what}`, error);
    }
  });
}

const CONTACT = { username: true, email: true, emailVerified: true } as const;

export function emailBannedLater(userId: string) {
  later(`${userId} about their ban`, async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ...CONTACT, banned: true, banReason: true, banExpires: true },
    });
    if (!user?.emailVerified || !user.banned) return;
    await sendBannedEmail({
      email: user.email,
      username: user.username,
      reason: user.banReason,
      until: user.banExpires,
    });
  });
}

export function emailBanLiftedLater(userId: string) {
  later(`${userId} that their ban was lifted`, async () => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: CONTACT,
    });
    if (!user?.emailVerified) return;
    await sendBanLiftedEmail({
      email: user.email,
      username: user.username,
      at: new Date(),
      url: new URL('/sign-in', siteURL).href,
    });
  });
}

export function emailUnverifiedLater(profileId: string) {
  later(`the owner of ${profileId} that it's back in review`, async () => {
    const shark = await prisma.profile.findUnique({
      where: { id: profileId },
      select: { displayName: true, user: { select: CONTACT } },
    });
    if (!shark?.user.emailVerified) return;
    await sendSharkUnverifiedEmail({
      email: shark.user.email,
      username: shark.user.username,
      shark: shark.displayName,
      url: new URL('/dashboard/profiles', siteURL).href,
    });
  });
}

/** The report, its shark, and who made it, if they're still around to email. */
async function report(reportId: string) {
  const found = await prisma.report.findUnique({
    where: { id: reportId },
    select: {
      reason: true,
      details: true,
      status: true,
      contactNote: true,
      createdAt: true,
      handledAt: true,
      profile: { select: { displayName: true } },
      reporter: { select: CONTACT },
    },
  });
  if (!found?.reporter?.emailVerified) return null;
  return {
    ...found,
    reason: found.contactNote
      ? "How to reach the shark's owner"
      : REPORT_REASONS[found.reason],
  };
}

export function emailReportReceivedLater(reportId: string) {
  later(`the reporter of ${reportId} that it arrived`, async () => {
    const found = await report(reportId);
    if (!found?.reporter) return;
    await sendReportReceivedEmail({
      email: found.reporter.email,
      username: found.reporter.username,
      shark: found.profile.displayName,
      reason: found.reason,
      details: found.details,
      at: found.createdAt,
    });
  });
}

export function emailReportReviewedLater(reportId: string) {
  later(`the reporter of ${reportId} that it was reviewed`, async () => {
    const found = await report(reportId);
    if (!found?.reporter || found.status === 'OPEN') return;
    await sendReportReviewedEmail({
      email: found.reporter.email,
      username: found.reporter.username,
      shark: found.profile.displayName,
      reason: found.reason,
      actedOn: found.status === 'RESOLVED',
      at: found.handledAt ?? new Date(),
    });
  });
}
