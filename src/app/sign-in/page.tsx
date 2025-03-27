import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

import { signInMetadata } from '@/constants/metadata';

import { LogIn } from '@/components/auth/login';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { TypographyH3 } from '@/components/typography';

export const metadata = signInMetadata;

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) redirect('/');

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted w-full py-63'>
          <div className='container mx-auto px-4 md:px-8'>
            <div className='flex flex-col items-center gap-4'>
              <TypographyH3>Sign in using...</TypographyH3>

              <LogIn />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
