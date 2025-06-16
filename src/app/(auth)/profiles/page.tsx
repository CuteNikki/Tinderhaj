import { getCurrentProfiles } from '@/lib/actions';
import { Account, Profile } from '@prisma/client';

import { CreateProfile } from '@/components/auth/create-profile';
import { ProfileForm } from '@/components/auth/profile-form';
import { ProfileCard } from '@/components/discovery/profile-card';

import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

import { TypographyMuted } from '@/components/typography';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const profiles = await getCurrentProfiles();

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted w-full py-12'>
          <div className='container mx-auto flex flex-col items-center justify-evenly gap-10 px-4'>
            <Card className='w-full max-w-md gap-6 text-center'>
              <CardHeader>
                <CardTitle className='pt-2 text-xl font-bold'>Customize Profiles</CardTitle>
                <CardDescription className='text-pretty'>Change any details below to personalize your profiles!</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col items-center gap-2'>
                {profiles.length === 0 ? (
                  <div className='flex w-full max-w-md flex-col items-center gap-4'>
                    <p className='text-muted-foreground text-center'>You have no profiles yet. Create one to get started!</p>
                  </div>
                ) : (
                  <div className='flex w-full max-w-md flex-col items-center gap-4'>
                    <p className='text-muted-foreground text-center'>
                      You have {profiles.length}/5 profile{profiles.length > 1 ? 's' : ''}.
                    </p>
                  </div>
                )}
                <CreateProfile disableButton={profiles.length >= 5} />
              </CardContent>
            </Card>
            <div className='flex flex-wrap gap-6'>
              {profiles.map((profile, index) => (
                <Card key={`profile-form-${index}-${profile.id}`} className='flex flex-col gap-4'>
                  <CardContent className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-8 lg:flex-row'>
                      <ProfileForm profile={profile} />
                      <ProfileCard className='h-fit' profile={profile as Profile & { Account: Account }} />
                    </div>
                    <TypographyMuted className='text-sm'>
                      Updating your profile will <span className='underline'>remove your verification</span> status.
                      <br />
                      Any changes will need to be approved. Current Status: {profile?.isVerified ? 'Verified' : 'Unverified'}
                    </TypographyMuted>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
