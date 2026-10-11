import { PageLoading } from '@/components/common/page-loading';
import { ButtonSkeleton, ProfileCardSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Tinderhaj'
      title='Shark'
      placeholder='On Tinderhaj since September 2026'
      // The button to the owner's other sharks, there for everyone
      below={<ButtonSkeleton className='mt-4'>{"All of @someone's sharks"}</ButtonSkeleton>}
    >
      <div className='max-w-md'>
        <ProfileCardSkeleton />
      </div>
    </PageLoading>
  );
}
