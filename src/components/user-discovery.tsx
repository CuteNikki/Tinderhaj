import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { QUERIES } from '@/lib/queries';

import { TypographyLead } from '@/components/typography';
import { UserCard, UserCardSkeleton } from '@/components/user-card';
import { UserFilter } from '@/components/user-filter';
import { UserDiscoveryPagination, UserDiscoveryPaginationSkeleton } from '@/components/user-pagination';

const searchParamsSchema = z.object({
  query: z.preprocess((val) => val, z.string().optional().default('')),
  page: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  take: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(5)),
});

export async function UserDiscovery({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page, take, query } = searchParamsSchema.parse(await searchParams);
  const { users, totalUsers } = await (query?.length ? QUERIES.filterUsers(query, page, take) : QUERIES.getUsers(page, take));

  const totalPages = Math.ceil(totalUsers / take);

  if (totalPages !== 0 && page > totalPages) {
    redirect(`?query=${query}&page=${totalPages < 1 ? 1 : totalPages}&take=${take}`);
  }

  return (
    <>
      <UserFilter page={page} take={take} query={query} />
      <div className='flex max-w-5xl flex-wrap justify-center gap-2'>
        {users.length ? (
          users.map((user, index) => <UserCard user={user} key={`user-${index}-${user.id}`} />)
        ) : (
          <TypographyLead>No search result!</TypographyLead>
        )}
      </div>
      <UserDiscoveryPagination
        displayedUsers={users.length}
        take={take}
        totalUsers={totalUsers}
        page={page}
        query={query}
        totalPages={totalPages === 0 ? 1 : totalPages}
      />
    </>
  );
}

export async function UserDiscoverySkeleton({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { take, query } = searchParamsSchema.parse(await searchParams);

  return (
    <>
      <UserFilter take={take} query={query} disabled />
      <div className='flex max-w-5xl flex-wrap justify-center gap-2'>
        {Array.from({ length: take }).map((_, index) => (
          <UserCardSkeleton key={`user-${index}-skeleton`} />
        ))}
      </div>
      <UserDiscoveryPaginationSkeleton take={take} />
    </>
  );
}
