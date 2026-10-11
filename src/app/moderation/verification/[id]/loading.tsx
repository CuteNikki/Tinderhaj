import { BackLink } from '@/components/common/heading';
import { PageLoading } from '@/components/common/page-loading';
import { ProfileCardSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading eyebrow='Review' title='Shark' above={<BackLink href='/moderation/verification'>Verification</BackLink>}>
      <div className='max-w-md'>
        <ProfileCardSkeleton ending='actions' />
      </div>
    </PageLoading>
  );
}
