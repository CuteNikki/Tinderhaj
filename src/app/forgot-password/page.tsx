import { forgotPasswordMetadata } from '@/constants/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';

import { KeyRoundIcon } from 'lucide-react';

import { requireSignedOut } from '@/lib/session';

import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = forgotPasswordMetadata;

export default async function ForgotPasswordPage() {
  await requireSignedOut();

  return (
    <AuthShell
      badge='Password recovery'
      icon={<KeyRoundIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Forgot your password?'
      description="Enter your email and we'll send you a link to reset it."
      footer={
        <p className='text-center text-sm text-muted-foreground'>
          Remembered it?{' '}
          <Link
            href='/sign-in'
            className='font-medium text-foreground underline'
          >
            Sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
