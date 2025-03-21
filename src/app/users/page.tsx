import { SearchParams } from 'next/dist/server/request/search-params';
import Link from 'next/link';
import { Suspense } from 'react';

import { TypographyH1 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { UserDiscovery, UserDiscoverySkeleton } from '@/components/user-discovery';

export default function UsersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <div className='grid justify-items-center gap-4 p-8'>
      <div className='flex flex-col items-center gap-4'>
        <Button asChild>
          <Link href='/'>Back to Home</Link>
        </Button>
        <TypographyH1>Users</TypographyH1>
      </div>
        <Suspense fallback={<UserDiscoverySkeleton searchParams={searchParams} />}>
          <UserDiscovery searchParams={searchParams} />
        </Suspense>
    </div>
  );
}
