import { ShieldCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';

import { twoFactorMetadata } from '@/constants/metadata';
import { requireSignedOut } from '@/lib/session';

import { AuthShell } from '@/components/auth/auth-shell';
import { TwoFactorForm } from '@/components/auth/two-factor-form';

export const metadata: Metadata = twoFactorMetadata;

/**
 * The second step of signing in with a password, for accounts with
 * two-step sign-in on. The sign-in form sends people here.
 */
export default async function TwoFactorPage({ searchParams }: PageProps<'/two-factor'>) {
  await requireSignedOut();

  const { methods } = await searchParams;
  const hasApp = typeof methods === 'string' && methods.split(',').includes('totp');

  return (
    <AuthShell
      badge='One more step'
      icon={<ShieldCheckIcon className='size-4 shrink-0' aria-hidden='true' />}
      title='Two-step sign-in'
      description='Your account asks for a code to finish signing in.'
    >
      <TwoFactorForm hasApp={hasApp} />
    </AuthShell>
  );
}
