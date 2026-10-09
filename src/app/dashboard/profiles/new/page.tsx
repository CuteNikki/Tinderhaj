import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MAX_PROFILES } from '@/constants/auth';
import { newProfileMetadata } from '@/constants/metadata';
import { QUERIES } from '@/lib/queries';
import { requireUser } from '@/lib/session';

import { BackLink, Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { ProfileForm } from '@/components/profiles/profile-form';

export const metadata: Metadata = newProfileMetadata;

export default async function NewProfilePage() {
  const { user } = await requireUser();
  // No room for another: back to the ones there are
  if ((await QUERIES.getUserProfiles(user.id)).length >= MAX_PROFILES) redirect('/dashboard/profiles');

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <BackLink href='/dashboard/profiles'>Profiles</BackLink>
          <Eyebrow>Your sharks</Eyebrow>
          <PageTitle>New profile</PageTitle>
          <PageNote>Fill in as much or as little as you like. You can change it all later.</PageNote>
        </Stagger>
        <ProfileForm username={user.name} />
      </div>
    </div>
  );
}
