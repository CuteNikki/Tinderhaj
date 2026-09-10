import { LockKeyholeIcon } from 'lucide-react';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/actions';

import { AuthShell } from '@/components/auth/auth-shell';
import { SignInForm } from '@/components/auth/sign-in-form';

export default async function SignInPage() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <AuthShell
      badge='Welcome back'
      icon={<LockKeyholeIcon className='h-3.5 w-3.5' />}
      title='Sign in to Tinderhaj'
      description='Pick up right where you left off with your plush matches.'
      footer={
        <p className='text-muted-foreground text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' className='text-foreground font-medium underline underline-offset-4'>
            Sign up
          </Link>
        </p>
      }
    >
      <SignInForm />
    </AuthShell>
  );
}
