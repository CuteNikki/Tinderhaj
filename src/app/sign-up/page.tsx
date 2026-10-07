import { SparklesIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { signUpMetadata } from '@/constants/metadata';
import { enabledProviders } from '@/lib/auth';
import { requireSignedOut } from '@/lib/session';

import { AuthShell } from '@/components/auth/auth-shell';
import { SignUpForm } from '@/components/auth/sign-up-form';
import { SocialButtons } from '@/components/auth/social-buttons';

export const metadata: Metadata = signUpMetadata;

export default async function SignUpPage() {
  await requireSignedOut();

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
      {enabledProviders.length > 0 && (
        <>
          <div className='text-muted-foreground my-6 flex items-center gap-3 text-xs'>
            <span className='bg-border h-px flex-1' />
            or
            <span className='bg-border h-px flex-1' />
          </div>
          {/* Signing up with a provider lands on sign-in if it fails, which says why. */}
          <SocialButtons providers={enabledProviders} errorCallbackURL='/sign-in' />
        </>
      )}
    </AuthShell>
  );
}
