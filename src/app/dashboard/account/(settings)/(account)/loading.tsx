import 'server-only';

import { enabledProviders } from '@/lib/auth';
import { configuredRoles, discordRolesEnabled } from '@/lib/discord-roles';

import { SettingsSection } from '@/components/common/settings-section';
import {
  ButtonSkeleton,
  FieldSkeleton,
  GhostText,
} from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Settings > Account while it loads, under the header and tabs (see the layout): its
 * sections, titled as they are, each holding placeholders laid out like its
 * form.
 */
export default function Loading() {
  // Shown when the real page shows it to someone without Discord connected
  const discordRoles =
    discordRolesEnabled() && enabledProviders.includes('discord')
      ? configuredRoles()
      : null;

  return (
    <div
      aria-busy='true'
      aria-label='Loading'
      className='grid max-w-3xl grid-cols-1 gap-6'
    >
      <SettingsSection
        still
        title='Username'
        description='Choose the name people will see across Tinderhaj.'
      >
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
          <FieldSkeleton className='flex-1' />
          <ButtonSkeleton>Change</ButtonSkeleton>
        </div>
      </SettingsSection>
      <SettingsSection
        still
        title='Reach me'
        description='Shown only to the owners of sharks that match one of yours, so you can talk. Leave it empty to share nothing.'
      >
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
          <FieldSkeleton className='flex-1' />
          <ButtonSkeleton>Save</ButtonSkeleton>
        </div>
      </SettingsSection>
      <SettingsSection
        still
        title='Email'
        description='Where we send sign-in codes and links to reset your password.'
      >
        <div className='space-y-4'>
          <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
            <Skeleton className='h-6 w-52' />
            <Skeleton className='h-5 w-20 rounded-full' />
          </div>
          <div className='flex flex-col gap-2 border-t border-foreground/10 pt-4'>
            <Skeleton className='h-3.5 w-20' />
            <div className='flex flex-col gap-2 sm:flex-row'>
              <Skeleton className='h-9 w-full rounded-md' />
              <ButtonSkeleton>Change</ButtonSkeleton>
            </div>
            <GhostText className='text-xs'>
              For your safety, we first send a confirmation link to your current
              address, then one to the new address.
            </GhostText>
          </div>
        </div>
      </SettingsSection>
      {discordRoles && (
        <SettingsSection
          still
          title='Discord roles'
          description='Roles on the Tinderhaj Discord server for what you do here. They update by themselves; refresh if they look out of date.'
        >
          <div className='flex flex-col gap-4'>
            <ul className='flex flex-col gap-2'>
              {discordRoles.map((role) => (
                <li key={role.key} className='flex items-start gap-3 text-sm'>
                  <Skeleton className='mt-0.5 size-5 shrink-0 rounded-full' />
                  {/* The real words, unseen, so each wraps as the real one does */}
                  <GhostText as='span' className='text-wrap'>
                    <span className='font-semibold'>{role.label}</span> ·{' '}
                    {role.about}
                  </GhostText>
                </li>
              ))}
            </ul>
            <GhostText>
              Connect Discord under Sign-in methods to get them.
            </GhostText>
          </div>
        </SettingsSection>
      )}
      <SettingsSection
        still
        title='Delete account'
        description="This permanently deletes your account, profiles, and sessions. We'll email you a link to confirm first."
        destructive
      >
        <ButtonSkeleton>Delete account</ButtonSkeleton>
      </SettingsSection>
    </div>
  );
}
