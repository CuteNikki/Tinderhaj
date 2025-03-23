import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { QUERIES } from '@/lib/queries';

import { NoResults } from '@/components/discovery/no-results';
import { ProfileFilter } from '@/components/discovery/profile-filter';
import { ProfileList, ProfileListSkeleton } from '@/components/discovery/profile-list';
import { ProfilePagination, ProfilePaginationSkeleton } from '@/components/discovery/profile-pagination';

const searchParamsSchema = z.object({
  q: z.preprocess((val) => val, z.string().optional().default('')),
  p: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  t: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(8)),
});

export async function Discovery({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { p: page, t: take, q: query } = searchParamsSchema.parse(await searchParams);
  const { users, totalUsers } = await (query?.length ? QUERIES.filterUsers(query, page, take) : QUERIES.getUsers(page, take));

  const totalPages = Math.ceil(totalUsers / take);

  if (totalPages !== 0 && page > totalPages) {
    redirect(`?query=${query}&page=${totalPages < 1 ? 1 : totalPages}&take=${take}`);
  }

  return (
    <>
      <ProfileFilter page={page} query={query} take={take} />
      {totalUsers ? <ProfileList users={users} /> : <NoResults />}
      <ProfilePagination displayedUsers={users.length} totalUsers={totalUsers} totalPages={totalPages} take={take} page={page} query={query} />
    </>
  );
}

export function DiscoverySkeleton() {
  return (
    <>
      <ProfileFilter disabled />
      <ProfileListSkeleton />
      <ProfilePaginationSkeleton />
    </>
  );
}
