import { ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { SearchParams } from 'next/dist/server/request/search-params';
import Link from 'next/link';

import { resetPasswordMetadata } from '@/constants/metadata';
import { requireSignedOut } from '@/lib/session';

import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = resetPasswordMetadata;

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await requireSignedOut();

  // Better Auth sends expired or used links here with ?error=INVALID_TOKEN.
  const { token, error } = await searchParams;
  const resetToken = typeof token === 'string' && !error ? token : '';

  return (
    <AuthShell
      badge='Almost there'
      icon={<ShieldCheckIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Choose a new password'
      description="Pick something you'll remember this time."
    >
      {resetToken ? (
        <ResetPasswordForm token={resetToken} />
      ) : (
        <p className='text-muted-foreground text-sm'>
          This reset link is invalid or has expired. Please{' '}
          <Link href='/forgot-password' className='text-foreground font-medium underline'>
            request a new one
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
