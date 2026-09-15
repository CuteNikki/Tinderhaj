import type { Metadata } from 'next';

import { accountMetadata } from '@/constants/metadata';
import { getCurrentUser } from '@/lib/actions';

import { AccountSettings } from '@/components/account/account-settings';
import { ScrollReveal } from '@/components/home/scroll-reveal';

export const metadata: Metadata = accountMetadata;

export default async function AccountPage() {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <ScrollReveal>
          <div className='mb-8'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Your account</p>
            <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Account Settings</h1>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <AccountSettings username={session.account.username} />
        </ScrollReveal>
      </div>
    </div>
  );
}
