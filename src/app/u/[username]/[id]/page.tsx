import { ShieldIcon, UserRoundIcon, UsersRoundIcon } from 'lucide-react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { connection } from 'next/server';

import { sharkPageMetadata } from '@/constants/metadata';
import { getHeartStates, getSharkPage } from '@/lib/hearts';
import { CONTENT_DELAY } from '@/lib/motion';
import { getSession } from '@/lib/session';
import { calculateAge, sharkPath } from '@/lib/utils';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ShareButton } from '@/components/discovery/share-button';
import { CardHearts } from '@/components/hearts/card-hearts';
import { ReportButton } from '@/components/reports/report-dialog';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Button } from '@/components/ui/button';

// The stripe down the side of the card a link to it unfurls into, in Discord say: the water of its image.
export const viewport: Viewport = { themeColor: '#1d78d6' };

export async function generateMetadata({ params }: PageProps<'/u/[username]/[id]'>): Promise<Metadata> {
  // Its age, in the description, is as of today, as is whether its owner's banned.
  await connection();
  const { id } = await params;
  // As anyone would see it, so a banned account's shark shares like any other.
  const page = await getSharkPage(id, null);
  if (!page) return sharkPageMetadata;

  const { shark } = page;
  const age = calculateAge(shark.birthday);
  const facts = [
    shark.pronouns,
    age != null && (age === 1 ? '1 year old' : `${age} years old`),
    shark.size != null && `${shark.size}${shark.unit.toLowerCase()}`,
    shark.location && `from ${shark.location}`,
  ].filter(Boolean);

  return {
    title: shark.displayName,
    description: [
      `${shark.displayName}, a shark of @${shark.user.username} on Tinderhaj${facts.length ? `: ${facts.join(', ')}.` : '.'}`,
      shark.bio && (shark.bio.length > 200 ? `${shark.bio.slice(0, 199).trimEnd()}…` : shark.bio),
    ]
      .filter(Boolean)
      .join(' '),
  };
}

/** One shark, on its own: the page a link to it leads to. */
export default async function SharkPage({ params }: PageProps<'/u/[username]/[id]'>) {
  const { username, id } = await params;
  const session = await getSession();
  const page = await getSharkPage(id, session ? { id: session.user.id, role: session.user.role } : null);
  if (!page) notFound();

  const { shark, banned, own, moderator } = page;
  // Its owner has a new name since the link was made: to the link as it is now.
  if (decodeURIComponent(username) !== shark.user.username) redirect(sharkPath(shark));

  const hearts = session && !own ? await getHeartStates(session.user.id, [shark.id]) : null;

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24 flex flex-col items-start gap-4'>
          <div>
            <Eyebrow>
              A shark of{' '}
              <Link href={`/u/${shark.user.username}`} className='hover:underline'>
                @{shark.user.username}
              </Link>
            </Eyebrow>
            <PageTitle className='wrap-break-word'>{shark.displayName}</PageTitle>
            <PageNote>
              On Tinderhaj since {(shark.verifiedAt ?? shark.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {banned && ' · Banned: only moderators see this page'}
            </PageNote>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' asChild>
              <Link href={`/u/${shark.user.username}`}>
                <UsersRoundIcon aria-hidden='true' />
                {own ? 'All your sharks' : `All of @${shark.user.username}’s sharks`}
              </Link>
            </Button>
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
                <Link href={`/moderation/users/${page.userId}`}>
                  <ShieldIcon aria-hidden='true' />
                  Moderate
                </Link>
              </Button>
            )}
          </div>
        </Stagger>

        <ScrollReveal className='max-w-md' delay={CONTENT_DELAY} variant='card'>
          <DiscoveryProfile
            profile={shark}
            heading='h2'
            action={
              <div className='flex items-center gap-1'>
                <ShareButton shark={{ id: shark.id, displayName: shark.displayName, user: shark.user }} />
                <ReportButton shark={{ id: shark.id, displayName: shark.displayName }} signedIn={!!session} own={own} />
                <CardHearts target={{ id: shark.id, displayName: shark.displayName }} states={hearts?.[shark.id] ?? null} signedIn={!!session} own={own} />
              </div>
            }
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
