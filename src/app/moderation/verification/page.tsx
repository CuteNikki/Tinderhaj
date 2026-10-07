import { BadgeCheckIcon, ClockIcon, ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { verifyMetadata } from '@/constants/metadata';
import { isModerator, requireUser } from '@/lib/session';
import { QUERIES } from '@/lib/queries';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/common/empty-state';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { UnverifyButton } from '@/components/verify/unverify-button';
import { VerifyProfileCard } from '@/components/verify/verify-profile-card';

export const metadata: Metadata = verifyMetadata;

const TABS = {
  // Short, so both fit side by side on a phone.
  review: { label: 'Pending', icon: ClockIcon },
  recent: { label: 'Verified', icon: BadgeCheckIcon },
} as const;

type Tab = keyof typeof TABS;

/** Profiles waiting for review, and the latest verified ones, to undo a mistake. */
export default async function VerifyPage({ searchParams }: PageProps<'/moderation/verification'>) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to review profiles.</p>
      </div>
    );
  }

  const { tab: tabParam } = await searchParams;
  const tab: Tab = tabParam === 'recent' ? 'recent' : 'review';
  const [pending, recent] = await Promise.all([QUERIES.getPendingProfiles(), QUERIES.getRecentlyVerified()]);
  const counts: Record<Tab, number> = { review: pending.length, recent: recent.length };

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger className='mb-8'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Moderation</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Verification</h1>
        </Stagger>

        <ScrollReveal delay={CONTENT_DELAY}>
          <nav aria-label='Verification' className='bg-muted mb-6 grid max-w-md grid-cols-2 gap-1 rounded-xl p-1'>
            {(Object.keys(TABS) as Tab[]).map((key) => {
              const { label, icon: Icon } = TABS[key];
              return (
                <Link
                  key={key}
                  href={key === 'review' ? '/moderation/verification' : '/moderation/verification?tab=recent'}
                  aria-current={key === tab ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                    key === tab ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className='size-4 shrink-0' aria-hidden='true' />
                  <span className='truncate'>{label}</span>
                  <span className='text-muted-foreground text-xs tabular-nums'>{counts[key]}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollReveal>

        {tab === 'review' ? (
          pending.length ? (
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {pending.map((profile, index) => (
                <ScrollReveal
                  key={profile.id}
                  className='h-full'
                  delay={CONTENT_DELAY + 0.1 + index * STAGGER}
                  scrollDelay={(index % 3) * STAGGER}
                  variant='card'
                >
                  <VerifyProfileCard profile={profile} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal delay={CONTENT_DELAY + 0.1}>
              <EmptyState icon={ShieldCheckIcon} title='All caught up.' description='There are no profiles waiting for review right now.' />
            </ScrollReveal>
          )
        ) : recent.length ? (
          <>
            <ScrollReveal delay={CONTENT_DELAY + 0.1}>
              <p className='text-muted-foreground mb-4 text-sm text-pretty'>
                The latest ones, newest first. Verified one by mistake? Unverify it to send it back to review.
              </p>
            </ScrollReveal>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {recent.map((profile, index) => (
                <ScrollReveal
                  key={profile.id}
                  className='h-full'
                  delay={CONTENT_DELAY + 0.1 + index * STAGGER}
                  scrollDelay={(index % 3) * STAGGER}
                  variant='card'
                >
                  <DiscoveryProfile
                    profile={profile}
                    action={<UnverifyButton profile={{ id: profile.id, displayName: profile.displayName }} verifiedAt={profile.verifiedAt?.toISOString()} />}
                  />
                </ScrollReveal>
              ))}
            </div>
          </>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY + 0.1}>
            <EmptyState icon={BadgeCheckIcon} title='Nothing verified yet.' description='Profiles you verify show up here, newest first.' />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
