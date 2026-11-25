import type { Metadata } from 'next';
import Link from 'next/link';

import {
  HeartHandshakeIcon,
  HeartIcon,
  InboxIcon,
  MessageCircleIcon,
  SendIcon,
} from 'lucide-react';

import { heartsMetadata } from '@/constants/metadata';

import { getHearts, type HeartRow } from '@/lib/hearts';
import { CONTENT_DELAY } from '@/lib/motion';
import { requireUser } from '@/lib/session';
import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/common/empty-state';
import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { LinkedText } from '@/components/common/linked-text';
import { LocalTime } from '@/components/common/local-time';
import { Stagger } from '@/components/common/stagger';
import { HeartButton } from '@/components/hearts/heart-button';
import { MarkHeartsSeen } from '@/components/hearts/mark-hearts-seen';
import { ShareMatchButton } from '@/components/hearts/share-match-button';
import { SharkAvatar } from '@/components/hearts/shark-avatar';
import { SharkDialog } from '@/components/hearts/shark-dialog';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReportDialog } from '@/components/reports/report-dialog';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = heartsMetadata;

const TABS = {
  matches: {
    label: 'Matches',
    icon: HeartHandshakeIcon,
    empty: {
      title: 'No matches yet.',
      description:
        "When a shark you hearted hearts you back, or the other way round, you'll find them here.",
    },
  },
  received: {
    label: 'Received',
    icon: InboxIcon,
    empty: {
      title: 'No hearts yet.',
      description:
        'Hearts other sharks send yours show up here. Heart them back to make it a match.',
    },
  },
  sent: {
    label: 'Sent',
    icon: SendIcon,
    empty: {
      title: 'Nothing sent yet.',
      description:
        'Find a shark you like in discovery, and send them a heart from their profile.',
    },
  },
} as const;

type Tab = keyof typeof TABS;

/** The user's matches, and the hearts their sharks received and sent. */
export default async function HeartsPage({
  searchParams,
}: PageProps<'/dashboard/hearts'>) {
  const session = await requireUser();
  const { tab: tabParam } = await searchParams;
  const hearts = await getHearts(session.user.id);
  const unseen = [...hearts.matches, ...hearts.received].filter(
    (row) => row.unseen
  ).length;

  // Opens on whatever is new, else on matches.
  const tab: Tab =
    typeof tabParam === 'string' && tabParam in TABS
      ? (tabParam as Tab)
      : hearts.received.some((row) => row.unseen) &&
          !hearts.matches.some((row) => row.unseen)
        ? 'received'
        : 'matches';
  const rows = hearts[tab];

  return (
    <div
      data-water='band'
      className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'
    >
      <MarkHeartsSeen unseen={unseen} />
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Eyebrow>Your sharks</Eyebrow>
          <PageTitle>Hearts</PageTitle>
          <PageNote>Two sharks hearting each other is a match.</PageNote>
        </Stagger>

        <ScrollReveal delay={CONTENT_DELAY}>
          {/* On phones three labels don't fit: the open tab shows its label, the others only their icon and count */}
          <nav
            aria-label='Hearts'
            className='mb-4 flex max-w-md gap-1 rounded-full bg-muted p-1 sm:grid sm:grid-cols-3'
          >
            {(Object.keys(TABS) as Tab[]).map((key) => {
              const { label, icon: Icon } = TABS[key];
              const fresh = hearts[key].filter((row) => row.unseen).length;
              return (
                <Link
                  key={key}
                  href={
                    key === 'matches'
                      ? '/dashboard/hearts?tab=matches'
                      : `/dashboard/hearts?tab=${key}`
                  }
                  aria-current={key === tab ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-full py-2 text-sm font-medium transition-colors sm:px-2',
                    key === tab
                      ? 'min-w-0 flex-1 bg-background px-2 shadow-sm'
                      : 'px-3 text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className='size-4 shrink-0' aria-hidden='true' />
                  <span
                    className={cn('truncate', key !== tab && 'max-sm:sr-only')}
                  >
                    {label}
                  </span>
                  <span className='text-xs text-muted-foreground tabular-nums'>
                    {hearts[key].length}
                  </span>
                  {fresh > 0 && (
                    <span
                      className='size-2 shrink-0 rounded-full bg-primary'
                      aria-label={`${fresh} new`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollReveal>

        {tab === 'matches' && rows.length > 0 && !hearts.sharesContact && (
          <ScrollReveal delay={CONTENT_DELAY}>
            <p className='mb-4 text-sm text-muted-foreground'>
              Your matches can&apos;t see a way to reach you yet.{' '}
              <Link
                href='/dashboard/account#top'
                className='font-medium text-foreground underline'
              >
                Add one in Settings
              </Link>
              .
            </p>
          </ScrollReveal>
        )}

        {rows.length ? (
          <Stagger
            as='ul'
            itemAs='li'
            className='divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-card shadow-sm'
            gap={0.05}
            delay={CONTENT_DELAY + 0.1}
          >
            {rows.map((row) => (
              <HeartListRow key={row.id} row={row} tab={tab} />
            ))}
          </Stagger>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY + 0.1}>
            <EmptyState
              icon={HeartIcon}
              title={TABS[tab].empty.title}
              description={TABS[tab].empty.description}
            />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

function HeartListRow({ row, tab }: { row: HeartRow; tab: Tab }) {
  const { mine, theirs } = row;
  const what =
    tab === 'matches'
      ? `Matched with your ${mine.displayName}`
      : tab === 'received'
        ? `Hearted your ${mine.displayName}`
        : `Your ${mine.displayName} sent a heart`;

  return (
    <div className='p-4'>
      <div className='flex items-center gap-3'>
        <SharkDialog shark={theirs}>
          <button
            type='button'
            className='group flex min-w-0 flex-1 items-center gap-3 text-left'
          >
            <span className='relative shrink-0'>
              <SharkAvatar shark={theirs} className='size-12' />
              <SharkAvatar
                shark={mine}
                className='absolute -right-1 -bottom-1 size-6 border-2 border-card'
              />
            </span>
            <span className='min-w-0'>
              <span className='flex flex-wrap items-center gap-x-2'>
                <span className='truncate font-semibold group-hover:underline'>
                  {theirs.displayName}
                </span>
                {row.unseen && <Badge className='shrink-0'>New</Badge>}
              </span>
              <span className='block truncate text-xs text-muted-foreground'>
                @{theirs.user.username} · {what}{' '}
                <LocalTime iso={row.at.toISOString()} />
              </span>
            </span>
          </button>
        </SharkDialog>
        {tab === 'received' && (
          <HeartButton
            from={mine}
            to={{ id: theirs.id, displayName: theirs.displayName }}
            sent={false}
            received
          />
        )}
        {tab === 'sent' && (
          <HeartButton
            from={mine}
            to={{ id: theirs.id, displayName: theirs.displayName }}
            sent
            received={false}
          />
        )}
        {tab === 'matches' && (
          <>
            {/* On phones the tab already says so, and the name needs the room */}
            <Badge className='shrink-0 max-sm:hidden'>
              <HeartIcon className='fill-current' aria-hidden='true' />
              Match
            </Badge>
            <ShareMatchButton
              mine={{ id: mine.id, displayName: mine.displayName }}
              theirs={{ id: theirs.id, displayName: theirs.displayName }}
            />
          </>
        )}
      </div>
      {tab === 'matches' && (
        <MatchContact
          shark={{ id: theirs.id, displayName: theirs.displayName }}
          username={theirs.user.username}
          contact={row.contact ?? null}
        />
      )}
    </div>
  );
}

/**
 * How to reach a match's owner, with a way to report it: a footnote to the line above, as small and
 * right under it, lined up with its text. Only the way to reach them is brighter, to find at a glance.
 */
function MatchContact({
  shark,
  username,
  contact,
}: {
  shark: { id: string; displayName: string };
  username: string;
  contact: string | null;
}) {
  return (
    <p className='mt-1.5 flex items-start gap-1.5 pl-15 text-xs text-muted-foreground'>
      <MessageCircleIcon
        className='mt-px size-3.5 shrink-0'
        aria-hidden='true'
      />
      {contact ? (
        <>
          <span className='min-w-0 flex-1 wrap-break-word'>
            <span className='sr-only'>Reach @{username}: </span>
            <span className='text-foreground'>
              <LinkedText text={contact} />
            </span>
          </span>
          {/* Moderators never see these otherwise, so their matches are the ones to say */}
          <ReportDialog shark={shark} contact>
            <button
              type='button'
              className='shrink-0 underline-offset-4 hover:text-foreground hover:underline'
            >
              Report
            </button>
          </ReportDialog>
        </>
      ) : (
        <span>Hasn&apos;t shared a way to reach them yet.</span>
      )}
    </p>
  );
}
