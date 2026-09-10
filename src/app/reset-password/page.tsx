import { ShieldCheckIcon } from 'lucide-react';
import { SearchParams } from 'next/dist/server/request/search-params';
import Link from 'next/link';

import { getCurrentUser } from '@/lib/actions';

import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  await getCurrentUser({ redirectIfFound: true });

  const { token } = await searchParams;
  const resetToken = typeof token === 'string' ? token : '';

  return (
    <AuthShell
      badge='Almost there'
      icon={<ShieldCheckIcon className='h-3.5 w-3.5' />}
      title='Choose a new password'
      description="Pick something you'll remember this time."
    >
      {resetToken ? (
        <ResetPasswordForm token={resetToken} />
      ) : (
        <p className='text-muted-foreground text-sm'>
          This reset link is missing or invalid. Please{' '}
          <Link href='/forgot-password' className='text-foreground font-medium underline underline-offset-4'>
            request a new one
          </Link>
          .
        </p>
      )}
    </AuthShell>
  );
}
