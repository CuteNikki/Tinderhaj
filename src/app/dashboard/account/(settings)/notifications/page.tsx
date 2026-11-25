import type { Metadata } from 'next';

import { notificationsMetadata } from '@/constants/metadata';
import {
  NOTIFICATIONS,
  type NotificationKind,
} from '@/constants/notifications';

import { getAccountSettings } from '@/lib/account';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';
import { requireUser } from '@/lib/session';

import { NotificationToggle } from '@/components/account/notification-toggle';
import { SettingsSection } from '@/components/common/settings-section';

export const metadata: Metadata = notificationsMetadata;

/** Settings > Notifications: which emails about your sharks you get. */
export default async function NotificationsPage() {
  const { user, session } = await requireUser();
  const { notifications } = await getAccountSettings({
    userId: user.id,
    sessionId: session.id,
  });

  return (
    <div className='grid max-w-3xl grid-cols-1 gap-6'>
      <SettingsSection
        title='Emails'
        description='Emails about your sharks. Sign-in codes, links and anything about your account always come.'
        delay={CONTENT_DELAY + STAGGER}
      >
        <div className='flex flex-col gap-3'>
          {(Object.keys(NOTIFICATIONS) as NotificationKind[]).map((kind) => (
            <NotificationToggle
              key={kind}
              kind={kind}
              on={notifications[kind]}
            />
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
