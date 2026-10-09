import { BackLink } from '@/components/common/heading';
import { PageLoading } from '@/components/common/page-loading';
import { SettingsSection } from '@/components/common/settings-section';
import { ButtonSkeleton, FieldSkeleton, GhostText, ProfileGridSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Someone's page for moderators while it loads: its sections, titled as they
 * are, holding placeholders laid out like what's in them, as it looks to an
 * admin looking at an ordinary user, the usual case.
 */
export default function Loading() {
  return (
    <PageLoading
      eyebrow='Moderation'
      title='User'
      above={<BackLink href='/moderation/users'>Users</BackLink>}
      below={
        <>
          <GhostText className='mt-1 text-base'>someone@example.com</GhostText>
          <div className='mt-3 flex flex-wrap items-center gap-1.5'>
            <Skeleton className='h-5 w-12 rounded-full' />
            <Skeleton className='h-5 w-28 rounded-full' />
            <Skeleton className='h-5 w-16 rounded-full' />
            <Skeleton className='ml-1 h-3 w-28' />
          </div>
        </>
      }
    >
      <div className='grid gap-6'>
        <SettingsSection still title='Profiles' description={<GhostText as='span'>3 profiles, in any state of review.</GhostText>}>
          <ProfileGridSkeleton ending='unverify' />
        </SettingsSection>
        <SettingsSection still title='Role' description={<GhostText as='span'>Creates and manages their own profiles.</GhostText>}>
          <Skeleton className='h-9 w-36 rounded-md' />
        </SettingsSection>
        <SettingsSection
          still
          title='Ban'
          description='Signs them out everywhere and stops them signing in. They see the reason, if you give one, when they try.'
          destructive
        >
          <div className='flex flex-col gap-3'>
            <FieldSkeleton input='h-16' />
            <div className='flex flex-wrap items-end gap-3'>
              <FieldSkeleton className='w-40' />
              <ButtonSkeleton>Ban @someone</ButtonSkeleton>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection still title='Account' description='Things only admins can do. Each asks first.'>
          <div className='flex flex-wrap gap-2'>
            <ButtonSkeleton>Sign out everywhere</ButtonSkeleton>
            <ButtonSkeleton>Send password reset</ButtonSkeleton>
            <ButtonSkeleton>Delete account</ButtonSkeleton>
          </div>
        </SettingsSection>
      </div>
    </PageLoading>
  );
}
