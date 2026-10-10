import { PageLoading } from '@/components/common/page-loading';
import { ProfileCardSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Tinderhaj' title='Shark' placeholder='On Tinderhaj since September 2026'>
      <div className='max-w-md'>
        <ProfileCardSkeleton />
      </div>
    </PageLoading>
  );
}
