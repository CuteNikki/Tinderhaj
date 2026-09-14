import { SparklesIcon } from 'lucide-react';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/actions';

import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default async function SignUpPage() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <AuthShell
      badge='Join the club'
      icon={<SparklesIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Create your account'
      description='Join Tinderhaj to find your perfect plush match.'
      footer={
        <p className='text-muted-foreground text-center text-sm'>
          Already have an account?{' '}
          <Link href='/sign-in' className='text-foreground font-medium underline'>
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthShell>
  );
}
