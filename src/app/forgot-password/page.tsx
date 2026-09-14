import { KeyRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { forgotPasswordMetadata } from '@/constants/metadata';
import { getCurrentUser } from '@/lib/actions';

import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = forgotPasswordMetadata;

export default async function ForgotPasswordPage() {
  await getCurrentUser({ redirectIfFound: true });

  return (
    <AuthShell
      badge='Password recovery'
      icon={<KeyRoundIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Forgot your password?'
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <p className='text-muted-foreground text-center text-sm'>
          Remembered it?{' '}
          <Link href='/sign-in' className='text-foreground font-medium underline'>
            Sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
