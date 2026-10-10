import { ShieldIcon, UserRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { userPageMetadata } from '@/constants/metadata';
import { getHeartStates, getUserPage } from '@/lib/hearts';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { getSession } from '@/lib/session';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { EmptyState } from '@/components/common/empty-state';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ShareButton } from '@/components/discovery/share-button';
import { CardHearts } from '@/components/hearts/card-hearts';
import { ReportButton } from '@/components/reports/report-dialog';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: PageProps<'/u/[username]'>): Promise<Metadata> {
  const { username } = await params;
  // As anyone would see it, so a banned account's page shares like any other.
  const page = await getUserPage(decodeURIComponent(username), null);
  if (!page) return userPageMetadata;

  const { user, sharks } = page;
  const names = sharks.slice(0, 3).map((shark) => shark.displayName);
  if (sharks.length > 3) names.push(`${sharks.length - 3} more`);

  return {
    title: `@${user.username}`,
    description: names.length
      ? `Meet ${new Intl.ListFormat('en', { type: 'conjunction' }).format(names)}: the sharks of @${user.username} on Tinderhaj.`
      : `@${user.username} is on Tinderhaj. Their sharks show up here once they’re verified.`,
  };
}

/** Someone's sharks, for anyone to browse and heart. */
export default async function UserSharksPage({ params }: PageProps<'/u/[username]'>) {
  const { username } = await params;
  const session = await getSession();
  const page = await getUserPage(decodeURIComponent(username), session ? { id: session.user.id, role: session.user.role } : null);
  if (!page) notFound();

  const { user, sharks, banned, own, moderator } = page;
  const hearts =
    session && !own
      ? await getHeartStates(
          session.user.id,
          sharks.map((shark) => shark.id),
        )
      : null;

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24 flex flex-col items-start gap-4'>
          <div>
            <Eyebrow>{sharks.length === 1 ? '1 shark' : `${sharks.length} sharks`}</Eyebrow>
            <PageTitle className='break-all'>@{user.username}</PageTitle>
            <PageNote>
              Joined {user.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {banned && ' · Banned: only moderators see this page'}
            </PageNote>
          </div>
          {(own || moderator) && (
            <div className='flex flex-wrap gap-2'>
              {own && (
                <Button variant='outline' asChild>
                  <Link href='/dashboard/profiles'>
                    <UserRoundIcon aria-hidden='true' />
                    Manage your profiles
                  </Link>
                </Button>
              )}
              {moderator && !own && (
                <Button variant='outline' asChild>
                  <Link href={`/moderation/users/${user.id}`}>
                    <ShieldIcon aria-hidden='true' />
                    Moderate
                  </Link>
                </Button>
              )}
            </div>
          )}
        </Stagger>

        {sharks.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {sharks.map((shark, index) => (
              <ScrollReveal key={shark.id} className='h-full' delay={CONTENT_DELAY + index * STAGGER} scrollDelay={(index % 3) * STAGGER} variant='card'>
                <DiscoveryProfile
                  profile={shark}
                  heading='h2'
                  action={
                    <div className='flex items-center gap-1'>
                      <ShareButton shark={{ id: shark.id, displayName: shark.displayName, user: shark.user }} />
                      <ReportButton shark={{ id: shark.id, displayName: shark.displayName }} signedIn={!!session} own={own} />
                      <CardHearts
                        target={{ id: shark.id, displayName: shark.displayName }}
                        states={hearts?.[shark.id] ?? null}
                        signedIn={!!session}
                        own={own}
                      />
                    </div>
                  }
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY}>
            <EmptyState
              icon={UserRoundIcon}
              title='No sharks yet.'
              description={own ? 'Your sharks show up here once they’re verified.' : 'Their sharks show up here once they’re verified.'}
            />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
