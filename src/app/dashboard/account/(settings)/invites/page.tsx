import type { Metadata } from 'next';

import { invitePath } from '@/constants/invites';
import { invitesMetadata } from '@/constants/metadata';

import { countInvites } from '@/lib/invites';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { requireUser } from '@/lib/session';
import { siteURL } from '@/lib/site-url';

import { InviteSettings } from '@/components/account/invite-settings';
import { SettingsSection } from '@/components/common/settings-section';

export const metadata: Metadata = invitesMetadata;

/** Settings > Invites: your link to send friends, and the badges it earns. */
export default async function InvitesPage() {
  const { user } = await requireUser();
  const invites = await countInvites(user.id);

  return (
    <div className='grid max-w-3xl grid-cols-1 gap-6'>
      <SettingsSection
        title='Invite friends'
        description='Send friends your link. Once they sign up and get a shark verified, they count toward your badges, which show on your page.'
        delay={CONTENT_DELAY + STAGGER}
      >
        <InviteSettings
          link={new URL(invitePath(user.name), siteURL).href}
          count={invites}
        />
      </SettingsSection>
    </div>
  );
}
