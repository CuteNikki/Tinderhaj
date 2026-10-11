import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from '@/lib/roles';

import { PageLoading } from '@/components/common/page-loading';
import { ButtonSkeleton, GhostText, ListSkeleton } from '@/components/common/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

const FILTERS = [
  ['Everyone', 'All accounts on Tinderhaj.'],
  ...ROLES.map((role) => [`${ROLE_LABELS[role]}s`, ROLE_DESCRIPTIONS[role]]),
  ['Banned', "Can't sign in until their ban ends or is lifted."],
];

/**
 * The users page while it loads, as it looks to an admin, who sees
 * everyone's email: the filters, titled and described as they are, so they
 * wrap as the real ones do, then the search and rows shaped like the list's.
 */
export default function Loading() {
  return (
    <PageLoading eyebrow='Moderation' title='Users' placeholder='Open someone to see their profiles, change their role, ban them, or manage their account.'>
      <div className='mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5'>
        {FILTERS.map(([label, description]) => (
          <div key={label} className='border-foreground/10 bg-card rounded-2xl border p-4 shadow-sm'>
            <span className='flex h-8 items-center justify-between gap-2'>
              <GhostText as='span' className='text-base font-bold'>
                {label}
              </GhostText>
              <Skeleton className='h-6 w-5' />
            </span>
            <GhostText className='mt-1 text-xs'>{description}</GhostText>
          </div>
        ))}
      </div>
      <div className='mb-4 flex gap-2'>
        <Skeleton className='h-9 flex-1 rounded-md' />
        <ButtonSkeleton icon={false}>Search</ButtonSkeleton>
      </div>
      <ListSkeleton rows={6}>
        <div className='flex items-center gap-3 p-4'>
          <div className='min-w-0 flex-1'>
            <div className='flex h-6 items-center'>
              <Skeleton className='h-4 w-32' />
            </div>
            <GhostText>someone@example.com</GhostText>
            <GhostText className='text-xs'>Joined Oct 9, 2026 · 3 profiles</GhostText>
          </div>
          <Skeleton className='h-5 w-12 rounded-full' />
          <Skeleton className='size-4 shrink-0 rounded-sm' />
        </div>
      </ListSkeleton>
    </PageLoading>
  );
}
