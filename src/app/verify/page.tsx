import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/actions';
import { QUERIES } from '@/lib/queries';

import { ResetProfileButton, VerifyProfileButton } from '@/components/auth/verify-button';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { ProfileCard } from '@/components/discovery/profile-card';
import { TypographyH2, TypographyMuted } from '@/components/typography';

export default async function DashboardPage() {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  // Check if the user is admin/can verify profiles
  if (!session?.Profile?.canVerify) redirect('/');

  const unverifiedProfiles = await QUERIES.getUnverifiedProfiles();

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted flex min-h-[53vh] w-full py-12'>
          <div className='container mx-auto flex items-center justify-center px-4 md:px-8'>
            {unverifiedProfiles.length === 0 ? (
              <div className='flex flex-col items-center gap-4'>
                <TypographyH2>No unverified profiles</TypographyH2>
                <TypographyMuted>All profiles are verified.</TypographyMuted>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-8 text-center'>
                <TypographyH2>Unverified Profiles</TypographyH2>
                <div className='flex flex-wrap justify-center gap-6'>
                  {unverifiedProfiles.map((profile, index) => (
                    <ProfileCard className='text-start' key={`profile-card-${index}-${profile.id}`} profile={profile}>
                      <div className='flex flex-col gap-2 px-4 pb-4'>
                        <VerifyProfileButton profile={profile} />
                        <ResetProfileButton profile={profile} />
                      </div>
                    </ProfileCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
