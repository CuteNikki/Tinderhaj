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
  const { profiles, totalProfiles } = await (query?.length ? QUERIES.getProfilesWithQuery(query, page, take) : QUERIES.getProfiles(page, take));

  const totalPages = Math.ceil(totalProfiles / take);

  if (totalPages !== 0 && page > totalPages) {
    redirect(`?query=${query}&page=${totalPages < 1 ? 1 : totalPages}&take=${take}`);
  }

  return (
    <>
      <ProfileFilter page={page} query={query} take={take} />
      {totalProfiles ? <ProfileList profiles={profiles} /> : <NoResults />}
      <ProfilePagination displayedUsers={profiles.length} totalUsers={totalProfiles} totalPages={totalPages} take={take} page={page} query={query} />
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
