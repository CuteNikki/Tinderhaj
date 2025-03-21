import { SearchParams } from 'next/dist/server/request/search-params';

import { TypographyH3 } from '@/components/typography';
import { UserDiscovery, UserDiscoverySkeleton } from '@/components/user-discovery';
import { Suspense } from 'react';

export default function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className='flex flex-col items-center gap-4 p-4'>
      <TypographyH3>Users</TypographyH3>
      <Suspense fallback={<UserDiscoverySkeleton searchParams={searchParams} />}>
        <UserDiscovery searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
