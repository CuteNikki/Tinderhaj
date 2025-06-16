import { Account, Profile } from '@prisma/client';

import { ProfileCard, ProfileCardSkeleton } from '@/components/discovery/profile-card';

export function ProfileList({ profiles }: { profiles: (Profile & { Account: Account })[] }) {
  return (
    <section className='from-background to-muted w-full bg-gradient-to-b py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-wrap justify-center gap-6'>
          {profiles.map((profile, index) => (
            <ProfileCard key={`profile-card-${index}-${profile.id}`} profile={profile} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProfileListSkeleton() {
  return (
    <section className='from-background to-muted w-full bg-gradient-to-b py-8 md:py-12'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-wrap justify-center gap-6'>
          {[...Array(8)].map((_, index) => (
            <ProfileCardSkeleton key={`profile-card-skeleton-${index}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
