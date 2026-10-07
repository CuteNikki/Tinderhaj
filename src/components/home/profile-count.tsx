import { getDiscoverableProfileCount } from '@/lib/queries';

import { AnimatedCount } from '@/components/home/animated-count';

/** The number of profiles discovery shows, counting up. */
export async function ProfileCount() {
  const count = await getDiscoverableProfileCount();

  return (
    <>
      <AnimatedCount target={count} duration={1000} localize /> {count === 1 ? 'profile' : 'profiles'}
    </>
  );
}
