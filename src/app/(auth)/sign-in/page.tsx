import Link from 'next/link';

import { getCurrentUser } from '@/lib/actions';

import { SignInForm } from '@/components/auth/sign-in-form';
import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';

export default async function SignIn() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <main className='flex-1'>
        <section id='hero' className='bg-muted w-full py-24 lg:py-32'>
          <div className='container mx-auto flex items-center justify-center px-4 md:px-8'>
            <div className='flex max-w-sm flex-col gap-6'>
              <SignInForm />
              <div className='text-muted-foreground text-center text-xs text-balance'>
                By clicking continue, you agree to our{' '}
                <Link href='/terms' className='underline'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='/privacy' className='underline'>
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
