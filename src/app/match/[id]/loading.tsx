import { HeartIcon } from 'lucide-react';

import { PageLoading } from '@/components/common/page-loading';
import { ProfileCardSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading
      eyebrow="It's a match"
      title='Shark & Shark'
      placeholder='Hearted each other on November 25, 2026'
    >
      {/* As the page lays them out: two cards with a heart between */}
      <div className='grid max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
        <ProfileCardSkeleton />
        <div className='flex justify-center'>
          <span className='flex size-14 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-foreground/10'>
            <HeartIcon
              className='size-7 fill-current text-muted'
              aria-hidden='true'
            />
          </span>
        </div>
        <ProfileCardSkeleton />
      </div>
    </PageLoading>
  );
}
