import { PageLoading } from '@/components/common/page-loading';

export default function Loading() {
  return (
    <PageLoading
      eyebrow='Moderation'
      title='Users'
      placeholder='Open someone to see their profiles, or ban them. Only admins change roles and manage accounts.'
    />
  );
}
