'use client';

import { Loader2Icon, LinkIcon, UnlinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { providerLabel, SOCIAL_PROVIDERS, type SocialProviderId } from '@/lib/providers';

import { ProviderIcon } from '@/components/common/provider-icon';
import { Button } from '@/components/ui/button';

const SOCIAL_IDS = new Set<string>(SOCIAL_PROVIDERS.map((provider) => provider.id));

const linkErrors: Record<string, string> = {
  account_already_linked_to_different_user: 'That account is already connected to another Tinderhaj account.',
  unable_to_link_account: 'That account’s email isn’t verified there, so it can’t be connected.',
  email_not_found: 'That account didn’t share an email address, which Tinderhaj needs.',
};

/**
 * Providers to sign in with besides the password: connect or disconnect them.
 * One way to sign in always stays, so the account can't lock itself out.
 */
export function LinkedAccounts({
  providers,
  accounts,
  error,
}: {
  /** Providers set up on this site. */
  providers: SocialProviderId[];
  /** What this account can sign in with, `credential` being the password. */
  accounts: { id: string; providerId: string }[];
  /** Set by Better Auth when connecting fails and it redirects back here. */
  error?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    toast.error(linkErrors[error] ?? 'Unable to connect that account. Please try again.', { duration: 5000, position: 'top-center' });
    router.replace('/account');
  }, [error, router]);

  // Connected ones stay listed after their provider is turned off, so they
  // can still be disconnected.
  const connected = accounts.filter((account) => account.providerId !== 'credential');
  const shown = [...new Set<string>([...providers, ...connected.map((account) => account.providerId)])];
  const lastWay = accounts.length <= 1;

  async function connect(provider: string) {
    setPending(provider);
    const { error } = await authClient.linkSocial({ provider, callbackURL: '/account', errorCallbackURL: '/account' });
    // On success the browser is sent off to the provider.
    if (error) {
      setPending(null);
      toast.error(error.message ?? `Unable to connect ${providerLabel(provider)}!`, { duration: 5000, position: 'top-center' });
    }
  }

  async function disconnect(account: { id: string; providerId: string }) {
    setPending(account.providerId);
    const { error } = await authClient.unlinkAccount({ accountId: account.id });
    setPending(null);

    if (error) {
      toast.error(error.code === 'SESSION_EXPIRED' ? 'For safety, sign out and back in, then try again.' : (error.message ?? 'Unable to disconnect!'), {
        duration: 5000,
        position: 'top-center',
      });
      return;
    }

    toast.success(`${providerLabel(account.providerId)} disconnected.`, { duration: 5000, position: 'top-center' });
    router.refresh();
  }

  if (!shown.length) return <p className='text-muted-foreground text-sm'>No other ways to sign in are set up on Tinderhaj yet.</p>;

  return (
    <ul className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-lg border'>
      {shown.map((provider) => {
        const account = connected.find((account) => account.providerId === provider);
        const label = providerLabel(provider);
        return (
          <li key={provider} className='flex items-center gap-3 p-3 px-4'>
            {SOCIAL_IDS.has(provider) ? (
              <ProviderIcon provider={provider as SocialProviderId} className='text-muted-foreground size-5 shrink-0' />
            ) : (
              <LinkIcon className='text-muted-foreground size-5 shrink-0' aria-hidden='true' />
            )}
            <span className='flex-1 font-medium'>{label}</span>
            {account ? (
              <Button
                variant='destructive'
                size='sm'
                disabled={pending !== null || lastWay}
                title={lastWay ? 'Add a password first, so you can still sign in.' : undefined}
                onClick={() => disconnect(account)}
              >
                {pending === provider ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <UnlinkIcon aria-hidden='true' />}
                Disconnect
              </Button>
            ) : (
              <Button size='sm' variant='outline' disabled={pending !== null} onClick={() => connect(provider)}>
                {pending === provider ? <Loader2Icon className='animate-spin' aria-hidden='true' /> : <LinkIcon aria-hidden='true' />}
                Connect
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
