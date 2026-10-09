import { HeartHandshakeIcon, HeartIcon, InboxIcon, MessageCircleIcon, SendIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { heartsMetadata } from '@/constants/metadata';
import { getHearts, type HeartRow } from '@/lib/hearts';
import { CONTENT_DELAY } from '@/lib/motion';
import { requireUser } from '@/lib/session';
import { cn } from '@/lib/utils';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { EmptyState } from '@/components/common/empty-state';
import { LinkedText } from '@/components/common/linked-text';
import { LocalTime } from '@/components/common/local-time';
import { Stagger } from '@/components/common/stagger';
import { HeartButton } from '@/components/hearts/heart-button';
import { MarkHeartsSeen } from '@/components/hearts/mark-hearts-seen';
import { ReportDialog } from '@/components/reports/report-dialog';
import { SharkAvatar } from '@/components/hearts/shark-avatar';
import { SharkDialog } from '@/components/hearts/shark-dialog';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = heartsMetadata;

const TABS = {
  matches: {
    label: 'Matches',
    icon: HeartHandshakeIcon,
    empty: { title: 'No matches yet.', description: 'When a shark you hearted hearts you back, or the other way round, you’ll find them here.' },
  },
  received: {
    label: 'Received',
    icon: InboxIcon,
    empty: { title: 'No hearts yet.', description: 'Hearts other sharks send yours show up here. Heart them back to make it a match.' },
  },
  sent: {
    label: 'Sent',
    icon: SendIcon,
    empty: { title: 'Nothing sent yet.', description: 'Find a shark you like in discovery, and send them a heart from their profile.' },
  },
} as const;

type Tab = keyof typeof TABS;

/** The user's matches, and the hearts their sharks received and sent. */
export default async function HeartsPage({ searchParams }: PageProps<'/dashboard/hearts'>) {
  const session = await requireUser();
  const { tab: tabParam } = await searchParams;
  const hearts = await getHearts(session.user.id);
  const unseen = [...hearts.matches, ...hearts.received].filter((row) => row.unseen).length;

  // Opens on whatever is new, else on matches.
  const tab: Tab =
    typeof tabParam === 'string' && tabParam in TABS
      ? (tabParam as Tab)
      : hearts.received.some((row) => row.unseen) && !hearts.matches.some((row) => row.unseen)
        ? 'received'
        : 'matches';
  const rows = hearts[tab];

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <MarkHeartsSeen unseen={unseen} />
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Eyebrow>Your sharks</Eyebrow>
          <PageTitle>Hearts</PageTitle>
          <PageNote>Two sharks hearting each other is a match.</PageNote>
        </Stagger>

        <ScrollReveal delay={CONTENT_DELAY}>
          <nav aria-label='Hearts' className='bg-muted mb-4 grid max-w-md grid-cols-3 gap-1 rounded-full p-1'>
            {(Object.keys(TABS) as Tab[]).map((key) => {
              const { label, icon: Icon } = TABS[key];
              const fresh = hearts[key].filter((row) => row.unseen).length;
              return (
                <Link
                  key={key}
                  href={key === 'matches' ? '/dashboard/hearts?tab=matches' : `/dashboard/hearts?tab=${key}`}
                  aria-current={key === tab ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-medium transition-colors',
                    key === tab ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className='size-4 shrink-0' aria-hidden='true' />
                  <span className='truncate'>{label}</span>
                  <span className='text-muted-foreground text-xs tabular-nums'>{hearts[key].length}</span>
                  {fresh > 0 && <span className='bg-primary size-2 shrink-0 rounded-full' aria-label={`${fresh} new`} />}
                </Link>
              );
            })}
          </nav>
        </ScrollReveal>

        {tab === 'matches' && rows.length > 0 && !hearts.sharesContact && (
          <ScrollReveal delay={CONTENT_DELAY}>
            <p className='text-muted-foreground mb-4 text-sm'>
              Your matches can’t see a way to reach you yet.{' '}
              <Link href='/dashboard/account#top' className='text-foreground font-medium underline'>
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
            className='border-foreground/10 bg-card divide-foreground/10 divide-y rounded-2xl border shadow-sm'
            gap={0.05}
            delay={CONTENT_DELAY + 0.1}
          >
            {rows.map((row) => (
              <HeartListRow key={row.id} row={row} tab={tab} />
            ))}
          </Stagger>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY + 0.1}>
            <EmptyState icon={HeartIcon} title={TABS[tab].empty.title} description={TABS[tab].empty.description} />
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
          <button type='button' className='group flex min-w-0 flex-1 items-center gap-3 text-left'>
            <span className='relative shrink-0'>
              <SharkAvatar shark={theirs} className='size-12' />
              <SharkAvatar shark={mine} className='border-card absolute -right-1 -bottom-1 size-6 border-2' />
            </span>
            <span className='min-w-0'>
              <span className='flex flex-wrap items-center gap-x-2'>
                <span className='truncate font-semibold group-hover:underline'>{theirs.displayName}</span>
                {row.unseen && <Badge className='shrink-0'>New</Badge>}
              </span>
              <span className='text-muted-foreground block truncate text-xs'>
                @{theirs.user.username} · {what} <LocalTime iso={row.at.toISOString()} />
              </span>
            </span>
          </button>
        </SharkDialog>
        {tab === 'received' && <HeartButton from={mine} to={{ id: theirs.id, displayName: theirs.displayName }} sent={false} received />}
        {tab === 'sent' && <HeartButton from={mine} to={{ id: theirs.id, displayName: theirs.displayName }} sent received={false} />}
        {tab === 'matches' && (
          <Badge className='shrink-0'>
            <HeartIcon className='fill-current' aria-hidden='true' />
            Match
          </Badge>
        )}
      </div>
      {tab === 'matches' && (
        <MatchContact shark={{ id: theirs.id, displayName: theirs.displayName }} username={theirs.user.username} contact={row.contact ?? null} />
      )}
    </div>
  );
}

/** How to reach a match's owner, under its row and lined up with its text, with a way to report it. */
function MatchContact({ shark, username, contact }: { shark: { id: string; displayName: string }; username: string; contact: string | null }) {
  return (
    <p className='text-muted-foreground mt-3 flex items-start gap-2 pl-15 text-sm'>
      <MessageCircleIcon className='mt-0.5 size-4 shrink-0' aria-hidden='true' />
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
            <button type='button' className='hover:text-foreground shrink-0 text-xs underline-offset-4 hover:underline'>
              Report
            </button>
          </ReportDialog>
        </>
      ) : (
        <span>@{username} hasn’t shared a way to reach them yet.</span>
      )}
    </p>
  );
}
