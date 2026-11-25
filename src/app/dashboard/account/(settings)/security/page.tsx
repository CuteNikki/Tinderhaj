import type { Metadata } from 'next';

import { securityMetadata } from '@/constants/metadata';

import { getAccountSettings } from '@/lib/account';
import { enabledProviders } from '@/lib/auth';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { requireUser } from '@/lib/session';

import { LinkedAccounts } from '@/components/account/linked-accounts';
import { PasskeySettings } from '@/components/account/passkey-settings';
import { PasswordForm } from '@/components/account/password-form';
import { SessionList } from '@/components/account/session-list';
import { TwoFactorSettings } from '@/components/account/two-factor-settings';
import { SettingsSection } from '@/components/common/settings-section';

export const metadata: Metadata = securityMetadata;

/** Settings > Security: how you sign in, and where you're signed in. */
export default async function SecurityPage({
  searchParams,
}: PageProps<'/dashboard/account/security'>) {
  const { user, session } = await requireUser();
  const { error } = await searchParams;
  const {
    accounts,
    hasPassword,
    twoFactor,
    trustedDevices,
    passkeys,
    sessions,
  } = await getAccountSettings({ userId: user.id, sessionId: session.id });

  return (
    <div className='grid max-w-3xl grid-cols-1 gap-6'>
      <SettingsSection
        title='Password'
        description={
          hasPassword
            ? undefined
            : 'You sign in with another account. Add a password to also sign in with your email.'
        }
        delay={CONTENT_DELAY + STAGGER}
      >
        <PasswordForm hasPassword={hasPassword} />
      </SettingsSection>
      <SettingsSection
        title='Two-step sign-in'
        delay={CONTENT_DELAY + 2 * STAGGER}
      >
        <TwoFactorSettings
          method={twoFactor}
          hasPassword={hasPassword}
          emailVerified={user.emailVerified}
          trustedDevices={trustedDevices}
        />
      </SettingsSection>
      <SettingsSection
        title='Passkeys'
        description='Sign in with your fingerprint, face or device PIN instead of a password. Passkeys only work on the device that made them, or the ones it syncs with.'
        delay={CONTENT_DELAY + 3 * STAGGER}
      >
        <PasskeySettings passkeys={passkeys} />
      </SettingsSection>
      <SettingsSection
        title='Sign-in methods'
        description='Connect other accounts to sign in with them too.'
        delay={CONTENT_DELAY + 4 * STAGGER}
      >
        <LinkedAccounts
          providers={enabledProviders}
          accounts={accounts}
          error={typeof error === 'string' ? error : undefined}
        />
      </SettingsSection>
      <SettingsSection
        title='Sessions'
        description='Everywhere you are signed in right now.'
        delay={CONTENT_DELAY + 5 * STAGGER}
      >
        <SessionList sessions={sessions} />
      </SettingsSection>
    </div>
  );
}
