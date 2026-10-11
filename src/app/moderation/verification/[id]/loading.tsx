import { BackLink } from '@/components/common/heading';
import { PageLoading } from '@/components/common/page-loading';
import { GhostText, ProfileCardSkeleton } from '@/components/common/skeletons';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Review'
      title='Shark'
      above={<BackLink href='/moderation/verification'>Verification</BackLink>}
      below={<GhostText className='mt-1 text-base'>From @someone, sent 2 hours ago</GhostText>}
    >
      <div className='max-w-md'>
        <ProfileCardSkeleton ending='actions' />
      </div>
    </PageLoading>
  );
}
