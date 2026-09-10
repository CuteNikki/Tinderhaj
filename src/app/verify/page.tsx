import { ShieldCheckIcon } from 'lucide-react';

import { getCurrentUser } from '@/lib/actions';
import { QUERIES } from '@/lib/queries';

import { ScrollReveal } from '@/components/home/scroll-reveal';
import { VerifyProfileCard } from '@/components/verify/verify-profile-card';

export default async function VerifyPage() {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: true });

  if (session.account.role !== 'MODERATOR' && session.account.role !== 'ADMIN') {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to review profiles.</p>
      </div>
    );
  }

  const profiles = await QUERIES.getPendingProfiles();

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <ScrollReveal>
          <div className='mb-8'>
            <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Moderation</p>
            <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Verify Profiles</h1>
          </div>
        </ScrollReveal>

        {profiles.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {profiles.map((profile, index) => (
              <ScrollReveal key={profile.id} className='h-full' delay={index * 0.1}>
                <VerifyProfileCard profile={profile} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal delay={0.1}>
            <div className='py-16'>
              <div className='mx-auto flex max-w-xl flex-col items-center text-center'>
                <div className='bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full'>
                  <ShieldCheckIcon className='h-7 w-7' />
                </div>
                <h2 className='mt-6 text-3xl font-black tracking-tight sm:text-4xl'>All caught up.</h2>
                <p className='text-muted-foreground mt-4 text-sm leading-relaxed text-pretty'>There are no profiles waiting for review right now.</p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
