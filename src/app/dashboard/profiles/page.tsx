import { UserRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { profilesMetadata } from '@/constants/metadata';
import { QUERIES } from '@/lib/queries';
import { requireUser } from '@/lib/session';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageTitle } from '@/components/common/heading';
import { CreateProfile } from '@/components/auth/create-profile';
import { EmptyState } from '@/components/common/empty-state';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { ProfileCard } from '@/components/profiles/profile-card';

export const metadata: Metadata = profilesMetadata;

export default async function ProfilesPage() {
  const session = await requireUser();
  const profiles = await QUERIES.getUserProfiles(session.user.id);

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24 flex flex-col items-start gap-4'>
          <div>
            <Eyebrow>Your sharks</Eyebrow>
            <PageTitle>Profiles</PageTitle>
          </div>
          <CreateProfile username={session.user.name} disableButton={profiles.length >= 5} />
        </Stagger>

        {profiles.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {profiles.map((profile, index) => (
              <ScrollReveal key={profile.id} className='h-full' delay={CONTENT_DELAY + index * STAGGER} scrollDelay={(index % 3) * STAGGER} variant='card'>
                <ProfileCard profile={profile} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={CONTENT_DELAY}>
            <EmptyState
              icon={UserRoundIcon}
              title='No profiles yet.'
              description="Create your first profile to start showing up in discovery once it's verified."
            />
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
