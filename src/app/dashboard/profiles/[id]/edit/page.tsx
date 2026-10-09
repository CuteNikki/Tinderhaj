import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { editProfileMetadata } from '@/constants/metadata';
import { QUERIES } from '@/lib/queries';
import { requireUser } from '@/lib/session';

import { BackLink, Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { ProfileForm } from '@/components/profiles/profile-form';

export const metadata: Metadata = editProfileMetadata;

export default async function EditProfilePage({ params }: PageProps<'/dashboard/profiles/[id]/edit'>) {
  const { user } = await requireUser();
  const { id } = await params;
  // Only your own
  const profile = await QUERIES.getOwnProfile(user.id, id);
  if (!profile) notFound();

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <BackLink href='/dashboard/profiles'>Profiles</BackLink>
          <Eyebrow>Your sharks</Eyebrow>
          <PageTitle className='break-all'>{profile.displayName}</PageTitle>
          <PageNote>Changes are saved as a draft, for you to send for review again.</PageNote>
        </Stagger>
        <ProfileForm username={user.name} profile={profile} />
      </div>
    </div>
  );
}
