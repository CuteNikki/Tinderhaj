import { MAX_AVATAR_SIZE_MB, MAX_BANNER_SIZE_MB } from '@/constants/uploads';

import { Eyebrow } from '@/components/common/heading';
import { SettingsSection } from '@/components/common/settings-section';
import { ButtonSkeleton, FieldSkeleton, GhostText, ProfileCardSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * A profile's form while it loads (see ProfileForm): its sections, titled as
 * they are, with placeholders laid out like their fields, and the card beside it.
 * `editing` for an existing one, whose interests show as chips above their field.
 */
export function ProfileFormSkeleton({ editing = false }: { editing?: boolean }) {
  return (
    <div className='grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-8'>
      <div className='grid gap-6'>
        <SettingsSection still title='Name' description='What everyone sees first, and what they call it.'>
          <div className='grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
        </SettingsSection>
        <SettingsSection still title='Pictures' description='A wide one across the top of its card, and a round one for its face, laid out as they show.'>
          <div className='@container'>
            {/* Side by side only when the card itself has room, whatever the screen */}
            <div className='grid items-start gap-5 @2xl:grid-cols-[minmax(0,1fr)_28rem]'>
              <div className='grid gap-3'>
                <div className='grid gap-3 text-sm'>
                  {[
                    ['Banner', `5:2, like 1200×480px, up to ${MAX_BANNER_SIZE_MB}MB.`],
                    ['Avatar', `Square, like 512×512px, up to ${MAX_AVATAR_SIZE_MB}MB.`],
                  ].map(([name, hint]) => (
                    <div key={name}>
                      <GhostText className='font-medium'>{name}</GhostText>
                      <GhostText className='mt-0.5'>{hint}</GhostText>
                    </div>
                  ))}
                </div>
                <GhostText className='text-xs'>Click either picture to upload a new one.</GhostText>
              </div>
              <div className='relative w-full max-w-md pb-10'>
                <Skeleton className='aspect-5/2 w-full rounded-md' />
                <span className='bg-card ring-card absolute bottom-0 left-4 size-24 rounded-full shadow-md ring-4 sm:left-6'>
                  <Skeleton className='size-full rounded-full' />
                </span>
              </div>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection still title='About' description='In its own words, and the things it loves.'>
          <div className='grid gap-4'>
            <div className='flex flex-col gap-2'>
              {/* As tall as the label row with its counter */}
              <div className='flex h-4 items-center'>
                <Skeleton className='h-3.5 w-10' />
              </div>
              <Skeleton className='h-16 w-full rounded-md' />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex h-4 items-center'>
                <Skeleton className='h-3.5 w-20' />
              </div>
              {editing && (
                <div className='flex gap-1.5'>
                  <Skeleton className='h-5 w-20 rounded-full' />
                  <Skeleton className='h-5 w-24 rounded-full' />
                </div>
              )}
              <div className='flex items-center gap-2'>
                <Skeleton className='h-9 flex-1 rounded-md' />
                <Skeleton className='size-9 rounded-full' />
              </div>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection still title='Details' description='All optional, to help the right sharks find it.'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FieldSkeleton />
            <FieldSkeleton />
            <div className='flex flex-col gap-2 sm:col-span-2'>
              <Skeleton className='h-3.5 w-10' />
              <div className='flex items-center gap-2'>
                <Skeleton className='h-9 w-full rounded-md sm:max-w-40' />
                <Skeleton className='h-9 w-24 shrink-0 rounded-md' />
              </div>
              <GhostText className='text-xs'>IKEA BLÅHAJ come in two sizes: small, 55cm, and large, 100cm.</GhostText>
            </div>
          </div>
        </SettingsSection>
      </div>
      <div className='w-full max-w-[26rem] lg:col-start-2 lg:row-span-2 lg:row-start-1'>
        <Eyebrow as='h2'>Preview</Eyebrow>
        <ProfileCardSkeleton ending='none' blank={!editing} />
      </div>
      <div className='px-3 sm:px-6 lg:col-start-1'>
        <div className='border-foreground/10 bg-background/85 xs:pl-5 flex w-full items-center gap-2 rounded-full border p-2 shadow-lg'>
          <GhostText className='xs:block hidden text-xs leading-tight sm:text-sm'>Saved as a draft</GhostText>
          <div className='max-xs:w-full ml-auto flex shrink-0 gap-2'>
            <ButtonSkeleton icon={false} className='max-xs:flex-1'>
              Cancel
            </ButtonSkeleton>
            <ButtonSkeleton icon={false} className='max-xs:flex-1'>
              {editing ? 'Save changes' : 'Create profile'}
            </ButtonSkeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
