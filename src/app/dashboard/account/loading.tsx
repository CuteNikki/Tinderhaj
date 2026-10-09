import 'server-only';

import { enabledProviders } from '@/lib/auth';

import { PageLoading } from '@/components/common/page-loading';
import { SettingsSection } from '@/components/common/settings-section';
import { ButtonSkeleton, FieldSkeleton, GhostText } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The account page while it loads: its sections, titled as they are, each
 * holding placeholders laid out like its form, for an account with a password,
 * one session and nothing else set up yet, the usual case.
 */
export default function Loading() {
  return (
    <PageLoading eyebrow='Your account' title='Settings'>
      <div className='grid items-start gap-6 lg:grid-cols-2'>
        <div className='grid gap-6'>
          <SettingsSection still title='Username' description='Choose the name people will see across Tinderhaj.'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
              <FieldSkeleton className='flex-1' />
              <ButtonSkeleton>Change</ButtonSkeleton>
            </div>
          </SettingsSection>
          <SettingsSection still title='Email' description='Where we send sign-in codes and links to reset your password.'>
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
                <Skeleton className='h-6 w-52' />
                <Skeleton className='h-5 w-20 rounded-full' />
              </div>
              <div className='border-foreground/10 flex flex-col gap-2 border-t pt-4'>
                <Skeleton className='h-3.5 w-20' />
                <div className='flex flex-col gap-2 sm:flex-row'>
                  <Skeleton className='h-9 w-full rounded-md' />
                  <ButtonSkeleton>Change</ButtonSkeleton>
                </div>
                <GhostText className='text-xs'>
                  For your safety, we first send a confirmation link to your current address, then one to the new address.
                </GhostText>
              </div>
            </div>
          </SettingsSection>
          <SettingsSection still title='Password'>
            <div className='flex flex-col gap-3'>
              <FieldSkeleton />
              <div className='grid gap-3 sm:grid-cols-2'>
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <Skeleton className='h-5 w-48' />
                <ButtonSkeleton className='sm:ml-auto'>Change password</ButtonSkeleton>
              </div>
            </div>
          </SettingsSection>
        </div>
        <div className='grid gap-6'>
          <SettingsSection still title='Sign-in methods' description='Connect other accounts to sign in with them too.'>
            <div className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-xl border'>
              {enabledProviders.map((provider) => (
                <div key={provider} className='flex items-center gap-3 p-3 px-4'>
                  <Skeleton className='size-5 shrink-0 rounded-full' />
                  <Skeleton className='h-5 w-20' />
                  <ButtonSkeleton size='sm' className='ml-auto'>
                    Connect
                  </ButtonSkeleton>
                </div>
              ))}
            </div>
          </SettingsSection>
          <SettingsSection still title='Two-step sign-in'>
            <div className='flex flex-col gap-3'>
              <GhostText>Asks for a code after your password, so your password alone isn’t enough to sign in. Choose where the code comes from:</GhostText>
              <div className='grid gap-3 sm:grid-cols-2'>
                {[
                  'A code from an app like Google Authenticator, 1Password or Bitwarden. The safest choice.',
                  'We email you a code each time you sign in with your password.',
                ].map((text) => (
                  <div key={text} className='ring-foreground/10 flex flex-col gap-2 rounded-xl p-4 ring-1'>
                    <span className='flex items-center gap-3'>
                      <Skeleton className='size-9 shrink-0 rounded-full' />
                      <Skeleton className='h-5 w-32' />
                    </span>
                    <GhostText as='span'>{text}</GhostText>
                  </div>
                ))}
              </div>
            </div>
          </SettingsSection>
          <SettingsSection
            still
            title='Passkeys'
            description='Sign in with your fingerprint, face or device PIN instead of a password. Passkeys only work on the device that made them, or the ones it syncs with.'
          >
            <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
              <FieldSkeleton className='flex-1' />
              <ButtonSkeleton>Add a passkey</ButtonSkeleton>
            </div>
          </SettingsSection>
        </div>
        <SettingsSection still title='Sessions' description='Everywhere you are signed in right now.' className='lg:col-span-2'>
          <div className='divide-foreground/10 border-foreground/10 flex flex-col divide-y rounded-xl border'>
            <div className='flex flex-col gap-1 p-3 px-4'>
              <span className='flex h-6 items-center gap-2'>
                <Skeleton className='size-5 shrink-0 rounded-full' />
                <Skeleton className='h-5 w-36' />
                <Skeleton className='h-5 w-20 rounded-full' />
              </span>
              {/* Each detail wraps as a whole, as the real ones do */}
              <ul className='flex flex-wrap gap-x-3 gap-y-0.5 text-sm'>
                <GhostText as='span'>IP 000.000.000.000</GhostText>
              </ul>
              <ul className='flex flex-wrap gap-x-3 gap-y-0.5 text-xs'>
                {['Signed in Oct 9, 2026, 10:00 AM', 'Active just now', 'Expires in 3 days'].map((detail) => (
                  <GhostText key={detail} as='span' className='text-xs'>
                    <span className='inline-block w-3.5' /> {detail}
                  </GhostText>
                ))}
              </ul>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection
          still
          title='Delete account'
          description='This permanently deletes your account, profiles, and sessions. We’ll email you a link to confirm first.'
          destructive
          className='lg:col-span-2'
        >
          <ButtonSkeleton>Delete account</ButtonSkeleton>
        </SettingsSection>
      </div>
    </PageLoading>
  );
}
