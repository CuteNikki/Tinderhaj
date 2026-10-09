import type { Metadata } from 'next';

import { accountMetadata } from '@/constants/metadata';
import { getAccountSettings } from '@/lib/account';
import { enabledProviders } from '@/lib/auth';
import { requireUser } from '@/lib/session';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { SettingsSection } from '@/components/common/settings-section';
import { Eyebrow, PageTitle } from '@/components/common/heading';
import { DeleteAccount } from '@/components/account/delete-account';
import { EmailSettings } from '@/components/account/email-settings';
import { LinkedAccounts } from '@/components/account/linked-accounts';
import { PasskeySettings } from '@/components/account/passkey-settings';
import { PasswordForm } from '@/components/account/password-form';
import { SessionList } from '@/components/account/session-list';
import { TwoFactorSettings } from '@/components/account/two-factor-settings';
import { UsernameForm } from '@/components/account/username-form';
import { Stagger } from '@/components/common/stagger';

export const metadata: Metadata = accountMetadata;

export default async function AccountPage({ searchParams }: PageProps<'/dashboard/account'>) {
  const { user, session } = await requireUser();
  const { error } = await searchParams;
  const { accounts, hasPassword, twoFactor, trustedDevices, passkeys, sessions } = await getAccountSettings({ userId: user.id, sessionId: session.id });

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Eyebrow>Your account</Eyebrow>
          <PageTitle>Settings</PageTitle>
        </Stagger>
        <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-2'>
          <div className='grid grid-cols-1 gap-6'>
            <SettingsSection title='Username' description='Choose the name people will see across Tinderhaj.' delay={CONTENT_DELAY}>
              <UsernameForm username={user.name} />
            </SettingsSection>
            <SettingsSection title='Email' description='Where we send sign-in codes and links to reset your password.' delay={CONTENT_DELAY + STAGGER}>
              <EmailSettings email={user.email} verified={user.emailVerified} />
            </SettingsSection>
            <SettingsSection
              title='Password'
              description={hasPassword ? undefined : 'You sign in with another account. Add a password to also sign in with your email.'}
              delay={CONTENT_DELAY + 2 * STAGGER}
            >
              <PasswordForm hasPassword={hasPassword} />
            </SettingsSection>
          </div>
          <div className='grid grid-cols-1 gap-6'>
            <SettingsSection title='Sign-in methods' description='Connect other accounts to sign in with them too.' delay={CONTENT_DELAY + STAGGER}>
              <LinkedAccounts providers={enabledProviders} accounts={accounts} error={typeof error === 'string' ? error : undefined} />
            </SettingsSection>
            <SettingsSection title='Two-step sign-in' delay={CONTENT_DELAY + 2 * STAGGER}>
              <TwoFactorSettings method={twoFactor} hasPassword={hasPassword} trustedDevices={trustedDevices} />
            </SettingsSection>
            <SettingsSection
              title='Passkeys'
              description='Sign in with your fingerprint, face or device PIN instead of a password. Passkeys only work on the device that made them, or the ones it syncs with.'
              delay={CONTENT_DELAY + 3 * STAGGER}
            >
              <PasskeySettings passkeys={passkeys} />
            </SettingsSection>
          </div>
          <SettingsSection title='Sessions' description='Everywhere you are signed in right now.' className='lg:col-span-2' delay={CONTENT_DELAY + 4 * STAGGER}>
            <SessionList sessions={sessions} />
          </SettingsSection>
          <SettingsSection
            title='Delete account'
            description='This permanently deletes your account, profiles, and sessions. We’ll email you a link to confirm first.'
            destructive
            className='lg:col-span-2'
            delay={CONTENT_DELAY + 5 * STAGGER}
          >
            <DeleteAccount hasPassword={hasPassword} />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
