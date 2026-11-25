import type { Metadata } from 'next';

import { accountMetadata } from '@/constants/metadata';

import { getAccountSettings } from '@/lib/account';
import { enabledProviders } from '@/lib/auth';
import { discordRoleList, discordRolesEnabled } from '@/lib/discord-roles';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { requireUser } from '@/lib/session';

import { DeleteAccount } from '@/components/account/delete-account';
import { DiscordRoles } from '@/components/account/discord-roles';
import { EmailSettings } from '@/components/account/email-settings';
import { MatchContactForm } from '@/components/account/match-contact-form';
import { UsernameForm } from '@/components/account/username-form';
import { SettingsSection } from '@/components/common/settings-section';

export const metadata: Metadata = accountMetadata;

/** Settings > Account: who you are here, how to reach you, and leaving. */
export default async function AccountPage() {
  const { user, session } = await requireUser();
  const { accounts, hasPassword, matchContact } = await getAccountSettings({
    userId: user.id,
    sessionId: session.id,
  });
  const discordLinked = accounts.some(
    (account) => account.providerId === 'discord'
  );
  // Only where Discord can be connected, or already is.
  const discordRoles =
    discordRolesEnabled() &&
    (discordLinked || enabledProviders.includes('discord'))
      ? await discordRoleList(user.id)
      : null;

  return (
    <div className='grid max-w-3xl grid-cols-1 gap-6'>
      <SettingsSection
        title='Username'
        description='Choose the name people will see across Tinderhaj.'
        delay={CONTENT_DELAY + STAGGER}
      >
        <UsernameForm username={user.name} />
      </SettingsSection>
      <SettingsSection
        title='Reach me'
        description='Shown only to the owners of sharks that match one of yours, so you can talk. Leave it empty to share nothing.'
        delay={CONTENT_DELAY + 2 * STAGGER}
      >
        <MatchContactForm contact={matchContact} />
      </SettingsSection>
      <SettingsSection
        title='Email'
        description='Where we send sign-in codes and links to reset your password.'
        delay={CONTENT_DELAY + 3 * STAGGER}
      >
        <EmailSettings email={user.email} verified={user.emailVerified} />
      </SettingsSection>
      {discordRoles && (
        <SettingsSection
          title='Discord roles'
          description='Roles on the Tinderhaj Discord server for what you do here. They update by themselves; refresh if they look out of date.'
          delay={CONTENT_DELAY + 4 * STAGGER}
        >
          <DiscordRoles roles={discordRoles} linked={discordLinked} />
        </SettingsSection>
      )}
      <SettingsSection
        title='Delete account'
        description="This permanently deletes your account, profiles, and sessions. We'll email you a link to confirm first."
        destructive
        delay={CONTENT_DELAY + 5 * STAGGER}
      >
        <DeleteAccount hasPassword={hasPassword} />
      </SettingsSection>
    </div>
  );
}
