import { NOTIFICATIONS } from '@/constants/notifications';

import { SettingsSection } from '@/components/common/settings-section';
import { GhostText } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Settings > Notifications while it loads, under the header and tabs (see the layout): its
 * sections, titled as they are, each holding placeholders laid out like its
 * form.
 */
export default function Loading() {
  return (
    <div
      aria-busy='true'
      aria-label='Loading'
      className='grid max-w-3xl grid-cols-1 gap-6'
    >
      <SettingsSection
        still
        title='Emails'
        description='Emails about your sharks. Sign-in codes, links and anything about your account always come.'
      >
        <div className='flex flex-col gap-3'>
          {Object.values(NOTIFICATIONS).map((notification) => (
            <div
              key={notification.field}
              className='flex items-center justify-between gap-4 text-sm'
            >
              <GhostText as='span'>{notification.label}</GhostText>
              {/* As big as the switch */}
              <Skeleton className='h-[18.4px] w-8 shrink-0 rounded-full' />
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
