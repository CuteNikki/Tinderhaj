import { KeyRoundIcon } from 'lucide-react';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/actions';

import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default async function ForgotPasswordPage() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <AuthShell
      badge='Password recovery'
      icon={<KeyRoundIcon className='h-3.5 w-3.5' />}
      title='Forgot your password?'
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <p className='text-muted-foreground text-center text-sm'>
          Remembered it?{' '}
          <Link href='/sign-in' className='text-foreground font-medium underline underline-offset-4'>
            Sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
