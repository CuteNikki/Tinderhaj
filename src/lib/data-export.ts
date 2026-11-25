import 'server-only';

import { INVITE_BADGES } from '@/constants/invites';
import { REPORT_REASONS } from '@/constants/reports';

import { countInvites } from '@/lib/invites';
import prisma from '@/lib/prisma';
import { siteURL } from '@/lib/site-url';
import { sharkPath } from '@/lib/utils';

/**
 * Everything Tinderhaj keeps about an account, for the person it belongs to
 * (the right of access and to a portable copy): what they wrote, what they
 * did, and what we noted about it. Left out: secrets (passwords, two-step
 * secrets, provider tokens), other people's private details (other owners'
 * way to be reached, who reported a shark), and moderators' own notes.
 * Other sharks and people appear only by name and username, as anyone sees
 * them.
 */
export async function buildDataExport(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      username: true,
      email: true,
      emailVerified: true,
      role: true,
      matchContact: true,
      twoFactorEnabled: true,
      verifiedEmails: true,
      matchEmails: true,
      heartsEmails: true,
      featuredEmails: true,
      birthdayEmails: true,
      inviteEmails: true,
      banned: true,
      banReason: true,
      banExpires: true,
      bannedAt: true,
      createdAt: true,
      updatedAt: true,
      invitedBy: { select: { username: true } },
      invitees: { select: { username: true, createdAt: true } },
      accounts: {
        select: { providerId: true, accountId: true, createdAt: true },
      },
      passkeys: {
        select: {
          name: true,
          deviceType: true,
          backedUp: true,
          createdAt: true,
        },
      },
      sessions: {
        select: {
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      reportsMade: {
        select: {
          reason: true,
          details: true,
          contactNote: true,
          status: true,
          createdAt: true,
          handledAt: true,
          profile: { select: SHARK },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const sharks = await prisma.profile.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      bannerUrl: true,
      birthday: true,
      size: true,
      unit: true,
      pronouns: true,
      location: true,
      interests: true,
      bio: true,
      status: true,
      rejectedFields: true,
      rejectionNote: true,
      submittedAt: true,
      verifiedAt: true,
      createdAt: true,
      updatedAt: true,
      heartsSent: {
        select: { createdAt: true, to: { select: SHARK } },
        orderBy: { createdAt: 'asc' },
      },
      heartsReceived: {
        select: { createdAt: true, seenAt: true, from: { select: SHARK } },
        orderBy: { createdAt: 'asc' },
      },
      featured: {
        select: { week: true, skipped: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      },
      sharedMatchesA: {
        select: { id: true, createdAt: true, profileB: { select: SHARK } },
      },
      sharedMatchesB: {
        select: { id: true, createdAt: true, profileA: { select: SHARK } },
      },
    },
  });

  const sharkIds = sharks.map((shark) => shark.id);
  const discordId = user.accounts.find(
    (account) => account.providerId === 'discord'
  )?.accountId;

  const [invites, sentEmails, discord] = await Promise.all([
    countInvites(userId),
    // The schedule's emails, noted by account or by shark (see SentEmail)
    prisma.sentEmail.findMany({
      where: {
        OR: [userId, ...sharkIds].map((id) => ({
          key: { startsWith: `${id}:` },
        })),
      },
      select: { kind: true, key: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    discordId ? discordData(discordId) : null,
  ]);

  return {
    about:
      "Everything Tinderhaj keeps about your account, as of when you downloaded it. Other people's sharks show only by name and username, as anyone sees them. Passwords, two-step secrets and sign-in tokens are left out, as are who reported your sharks and moderators' own notes. Questions: contact@tinderhaj.com.",
    exportedAt: new Date().toISOString(),
    account: {
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      joined: user.createdAt,
      lastChanged: user.updatedAt,
      reachMe: user.matchContact,
      twoStepSignIn: !!user.twoFactorEnabled,
      emails: {
        sharkVerified: user.verifiedEmails,
        newMatch: user.matchEmails,
        weeklyHearts: user.heartsEmails,
        sharkOfTheWeek: user.featuredEmails,
        sharkBirthdays: user.birthdayEmails,
        friendJoined: user.inviteEmails,
      },
      ban: user.banned
        ? {
            reason: user.banReason,
            since: user.bannedAt,
            until: user.banExpires,
          }
        : null,
    },
    invites: {
      invitedBy: user.invitedBy?.username ?? null,
      invited: user.invitees.map((friend) => ({
        username: friend.username,
        joined: friend.createdAt,
      })),
      countingTowardBadges: invites,
      badges: INVITE_BADGES.filter((badge) => invites >= badge.count).map(
        (badge) => badge.label
      ),
    },
    signIn: {
      connectedAccounts: user.accounts.map((account) => ({
        provider:
          account.providerId === 'credential' ? 'password' : account.providerId,
        connected: account.createdAt,
      })),
      passkeys: user.passkeys,
      sessions: user.sessions.map((session) => ({
        ipAddress: session.ipAddress,
        device: session.userAgent,
        signedIn: session.createdAt,
        lastActive: session.updatedAt,
        expires: session.expiresAt,
      })),
    },
    sharks: sharks.map((shark) => ({
      name: shark.displayName,
      page:
        shark.status === 'VERIFIED'
          ? new URL(sharkPath({ id: shark.id, user }), siteURL).href
          : null,
      avatar: shark.avatarUrl,
      banner: shark.bannerUrl,
      birthday: shark.birthday,
      size:
        shark.size == null ? null : `${shark.size} ${shark.unit.toLowerCase()}`,
      pronouns: shark.pronouns,
      location: shark.location,
      interests: shark.interests,
      bio: shark.bio,
      review: {
        status: shark.status.toLowerCase(),
        submitted: shark.submittedAt,
        verified: shark.verifiedAt,
        changesAskedFor: shark.rejectedFields,
        moderatorNote: shark.rejectionNote,
      },
      created: shark.createdAt,
      lastChanged: shark.updatedAt,
      heartsSent: shark.heartsSent.map((heart) => ({
        to: name(heart.to),
        at: heart.createdAt,
      })),
      heartsReceived: shark.heartsReceived.map((heart) => ({
        from: name(heart.from),
        at: heart.createdAt,
        seen: heart.seenAt,
      })),
      sharedMatches: [
        ...shark.sharedMatchesA.map((match) => ({
          with: name(match.profileB),
          page: new URL(`/match/${match.id}`, siteURL).href,
          shared: match.createdAt,
        })),
        ...shark.sharedMatchesB.map((match) => ({
          with: name(match.profileA),
          page: new URL(`/match/${match.id}`, siteURL).href,
          shared: match.createdAt,
        })),
      ],
      sharkOfTheWeek: shark.featured,
    })),
    reportsYouMade: user.reportsMade.map((report) => ({
      shark: name(report.profile),
      reason: report.contactNote
        ? "How to reach the shark's owner"
        : REPORT_REASONS[report.reason],
      details: report.details,
      status: report.status.toLowerCase(),
      sent: report.createdAt,
      reviewed: report.handledAt,
    })),
    scheduledEmailsSent: sentEmails,
    discord,
  };
}

/** Another shark, as anyone sees it. */
const SHARK = {
  displayName: true,
  user: { select: { username: true } },
} as const;

const name = (shark: { displayName: string; user: { username: string } }) =>
  `${shark.displayName} (@${shark.user.username})`;

/**
 * What the Discord bot keeps under their Discord id: their bubble's
 * settings, bubbles of theirs that are open, and moderation on the server
 * done to them, without who did it.
 */
async function discordData(discordId: string) {
  const [settings, bubbles, moderation] = await Promise.all([
    prisma.bubbleSettings.findUnique({
      where: { userId: discordId },
      select: {
        name: true,
        userLimit: true,
        locked: true,
        hidden: true,
        allowed: true,
        blocked: true,
        updatedAt: true,
      },
    }),
    prisma.bubble.findMany({
      where: { ownerId: discordId },
      select: {
        locked: true,
        hidden: true,
        allowed: true,
        blocked: true,
        createdAt: true,
      },
    }),
    prisma.moderation.findMany({
      where: { userId: discordId },
      select: {
        id: true,
        action: true,
        reason: true,
        until: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);
  return {
    discordId,
    bubbleSettings: settings,
    openBubbles: bubbles,
    moderationOnTheServer: moderation.map(({ id, ...rest }) => ({
      case: id,
      ...rest,
    })),
  };
}
