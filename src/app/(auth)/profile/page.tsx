import { getCurrentUser } from '@/lib/actions';

import { ProfileForm } from '@/components/auth/profile-form';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ProfilePage() {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: true });

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted w-full py-24'>
          <div className='container mx-auto flex items-center justify-center px-4 md:px-8'>
            <Card className='max-w-2xl'>
              <CardHeader className='text-center'>
                <CardTitle className='pt-2 text-xl font-bold'>Customize Profile</CardTitle>
                <CardDescription className='text-pretty'>Change any details below to personalize your profile!</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={session.Profile} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
