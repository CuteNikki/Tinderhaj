import { INVITE_BADGES } from '@/constants/invites';

import { SettingsSection } from '@/components/common/settings-section';
import { ButtonSkeleton, GhostText } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Settings > Invites while it loads, under the header and tabs (see the layout): its
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
        title='Invite friends'
        description='Send friends your link. Once they sign up and get a shark verified, they count toward your badges, which show on your page.'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-end'>
            <Skeleton className='h-9 flex-1 rounded-md' />
            <ButtonSkeleton>Copy link</ButtonSkeleton>
          </div>
          <div className='flex flex-col gap-2 border-t border-foreground/10 pt-4'>
            <GhostText>0 friends joined with a verified shark</GhostText>
            <ul className='flex flex-col gap-2'>
              {INVITE_BADGES.map((badge) => (
                <li key={badge.key} className='flex items-start gap-3 text-sm'>
                  <Skeleton className='mt-0.5 size-5 shrink-0 rounded-full' />
                  <GhostText as='span' className='text-wrap'>
                    <span className='font-semibold'>{badge.label}</span> ·{' '}
                    {badge.about}
                  </GhostText>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
