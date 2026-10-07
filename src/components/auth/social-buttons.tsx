'use client';

import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { providerLabel, type SocialProviderId } from '@/lib/providers';

import { ProviderIcon } from '@/components/common/provider-icon';
import { Stagger } from '@/components/common/stagger';
import { Button } from '@/components/ui/button';

/**
 * Signs in or up with a provider. New accounts land on the account page, to
 * see the username made from their name there.
 */
export function SocialButtons({ providers, errorCallbackURL }: { providers: SocialProviderId[]; errorCallbackURL: string }) {
  const [pending, setPending] = useState<SocialProviderId | null>(null);

  async function signIn(provider: SocialProviderId) {
    setPending(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: '/profiles',
      newUserCallbackURL: '/account',
      // Better Auth adds ?error=… to it.
      errorCallbackURL,
    });
    // On success the browser is sent off to the provider.
    if (error) {
      setPending(null);
      toast.error(error.message ?? `Unable to continue with ${providerLabel(provider)}!`, { duration: 5000, position: 'top-center' });
    }
  }

  if (!providers.length) return null;

  return (
    <Stagger className='grid gap-2 sm:grid-cols-2' itemClassName='sm:last:odd:col-span-2' variant='pop' gap={0.05}>
      {providers.map((provider) => (
        <Button key={provider} type='button' variant='outline' className='w-full' disabled={pending !== null} onClick={() => signIn(provider)}>
          {pending === provider ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <ProviderIcon provider={provider} />}
          {providerLabel(provider)}
        </Button>
      ))}
    </Stagger>
  );
}
