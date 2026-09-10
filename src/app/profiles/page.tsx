import { UserRoundIcon } from 'lucide-react';

import { getCurrentProfiles } from '@/lib/actions';

import { CreateProfile } from '@/components/auth/create-profile';
import { ProfileCard } from '@/components/profiles/profile-card';

export default async function ProfilesPage() {
  const profiles = await getCurrentProfiles();

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <div className='mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
          <div>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Your account</p>
            <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Manage Profiles</h1>
          </div>
          <CreateProfile disableButton={profiles.length >= 5} />
        </div>

        {profiles.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {profiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className='py-16'>
            <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
              <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
                <UserRoundIcon className='h-7 w-7' />
              </div>
              <h2 className='mt-6 text-3xl font-black tracking-tight sm:text-4xl'>No profiles yet.</h2>
              <p className='text-muted-foreground mt-4 text-sm leading-relaxed text-pretty'>
                Create your first profile to start showing up in discovery once it&apos;s verified.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
