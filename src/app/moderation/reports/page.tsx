import { ArchiveIcon, FlagIcon, InboxIcon, ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { reportsMetadata } from '@/constants/metadata';
import { CONTENT_DELAY } from '@/lib/motion';
import { QUERIES, type ReportRow } from '@/lib/queries';
import { REPORT_REASONS } from '@/lib/reports';
import { isModerator, requireUser } from '@/lib/session';
import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/common/empty-state';
import { Eyebrow, PageTitle } from '@/components/common/heading';
import { LocalTime } from '@/components/common/local-time';
import { Stagger } from '@/components/common/stagger';
import { SharkAvatar } from '@/components/hearts/shark-avatar';
import { SharkDialog } from '@/components/hearts/shark-dialog';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ReportActions } from '@/components/reports/report-actions';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = reportsMetadata;

const TABS = {
  open: { label: 'Open', icon: InboxIcon },
  handled: { label: 'Handled', icon: ArchiveIcon },
} as const;

type Tab = keyof typeof TABS;

/** What people reported, for moderators to deal with or dismiss, and the latest ones handled. */
export default async function ReportsPage({ searchParams }: PageProps<'/moderation/reports'>) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to see reports.</p>
      </div>
    );
  }

  const { tab: tabParam } = await searchParams;
  const tab: Tab = tabParam === 'handled' ? 'handled' : 'open';
  const [open, handled] = await Promise.all([QUERIES.getReports(true), QUERIES.getReports(false)]);
  const lists: Record<Tab, ReportRow[]> = { open, handled };
  const rows = lists[tab];

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Eyebrow>Moderation</Eyebrow>
          <PageTitle>Reports</PageTitle>
        </Stagger>

        <ScrollReveal delay={CONTENT_DELAY}>
          <nav aria-label='Reports' className='bg-muted mb-6 grid max-w-md grid-cols-2 gap-1 rounded-full p-1'>
            {(Object.keys(TABS) as Tab[]).map((key) => {
              const { label, icon: Icon } = TABS[key];
              return (
                <Link
                  key={key}
                  href={key === 'open' ? '/moderation/reports' : '/moderation/reports?tab=handled'}
                  aria-current={key === tab ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-medium transition-colors',
                    key === tab ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className='size-4 shrink-0' aria-hidden='true' />
                  <span className='truncate'>{label}</span>
                  <span className='text-muted-foreground text-xs tabular-nums'>{lists[key].length}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollReveal>

        {rows.length ? (
          <>
            {tab === 'handled' && (
              <ScrollReveal delay={CONTENT_DELAY + 0.1}>
                <p className='text-muted-foreground mb-4 text-sm text-pretty'>The latest ones, newest first.</p>
              </ScrollReveal>
            )}
            <Stagger
              as='ul'
              itemAs='li'
              className='border-foreground/10 bg-card divide-foreground/10 divide-y rounded-2xl border shadow-sm'
              gap={0.05}
              delay={CONTENT_DELAY + 0.1}
            >
              {rows.map((report) => (
                <ReportItem key={report.id} report={report} />
              ))}
            </Stagger>
          </>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY + 0.1}>
            {tab === 'open' ? (
              <EmptyState icon={ShieldCheckIcon} title='All caught up.' description='Nobody has reported anything that’s waiting for a look.' />
            ) : (
              <EmptyState icon={FlagIcon} title='Nothing handled yet.' description='Reports you deal with or dismiss show up here, newest first.' />
            )}
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}

function ReportItem({ report }: { report: ReportRow }) {
  const { profile, reporter } = report;

  return (
    <div className='flex flex-col gap-4 p-4 sm:flex-row sm:items-start'>
      <div className='flex min-w-0 flex-1 items-start gap-3'>
        <SharkDialog shark={profile}>
          <button type='button' className='shrink-0' aria-label={`Show ${profile.displayName}’s card`}>
            <SharkAvatar shark={profile} className='size-12' />
          </button>
        </SharkDialog>
        <div className='min-w-0 flex-1'>
          <p className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <SharkDialog shark={profile}>
              <button type='button' className='font-semibold hover:underline'>
                {profile.displayName}
              </button>
            </SharkDialog>
            <Badge variant='destructive'>{REPORT_REASONS[report.reason]}</Badge>
            {report.contactNote !== null && <Badge variant='outline'>How to reach them</Badge>}
          </p>
          <p className='text-muted-foreground text-xs'>
            Owned by{' '}
            <Link href={`/moderation/users/${profile.user.id}`} className='hover:text-foreground underline-offset-4 hover:underline'>
              @{profile.user.username}
            </Link>{' '}
            · reported by{' '}
            {reporter ? (
              <Link href={`/moderation/users/${reporter.id}`} className='hover:text-foreground underline-offset-4 hover:underline'>
                @{reporter.username}
              </Link>
            ) : (
              'an account since deleted'
            )}{' '}
            <LocalTime iso={report.createdAt.toISOString()} />
          </p>
          {/* As it was when reported, and plain: no links to follow from here */}
          {report.contactNote !== null && (
            <blockquote className='border-foreground/20 text-foreground mt-3 border-l-2 pl-3 text-sm wrap-break-word'>{report.contactNote}</blockquote>
          )}
          {report.details && <p className='text-foreground/80 mt-3 text-sm whitespace-pre-line'>{report.details}</p>}
          {report.status !== 'OPEN' && (
            <p className='text-muted-foreground mt-3 text-xs'>
              {report.status === 'RESOLVED' ? 'Dealt with' : 'Dismissed'} by {report.handledBy ? `@${report.handledBy.username}` : 'an account since deleted'}{' '}
              {report.handledAt && <LocalTime iso={report.handledAt.toISOString()} />}
            </p>
          )}
        </div>
      </div>
      {report.status === 'OPEN' && <ReportActions reportId={report.id} />}
    </div>
  );
}
