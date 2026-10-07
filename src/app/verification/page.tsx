import { ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { verifyMetadata } from '@/constants/metadata';
import { isModerator, requireUser } from '@/lib/session';
import { QUERIES } from '@/lib/queries';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { EmptyState } from '@/components/common/empty-state';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { VerifyProfileCard } from '@/components/verify/verify-profile-card';

export const metadata: Metadata = verifyMetadata;

export default async function VerifyPage() {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to review profiles.</p>
      </div>
    );
  }

  const profiles = await QUERIES.getPendingProfiles();

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger className='mb-8'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Moderation</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Profile Verification</h1>
        </Stagger>

        {profiles.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {profiles.map((profile, index) => (
              <ScrollReveal key={profile.id} className='h-full' delay={CONTENT_DELAY + index * STAGGER} scrollDelay={(index % 3) * STAGGER} variant='card'>
                <VerifyProfileCard profile={profile} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY}>
            <EmptyState icon={ShieldCheckIcon} title='All caught up.' description='There are no profiles waiting for review right now.' />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
