import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { QUERIES } from '@/lib/queries';

import { DiscoveryFilter } from '@/components/discovery/filter';
import { DiscoveryNoResults } from '@/components/discovery/no-results';
import { DiscoveryPagination } from '@/components/discovery/pagination';
import { DiscoveryProfile } from '@/components/discovery/profile';

const searchParamsSchema = z.object({
  q: z.preprocess((val) => val, z.string().optional().default('')),
  p: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  t: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(8)),
});

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q: query, p: page, t: take } = searchParamsSchema.parse(await searchParams);
  const { profiles, totalProfiles } = await (query?.length ? QUERIES.getProfilesWithQuery(query, page, take) : QUERIES.getProfiles(page, take));

  const totalPages = Math.ceil(totalProfiles / take);

  if (totalPages !== 0 && page > totalPages) {
    redirect(`?query=${query}&page=${totalPages < 1 ? 1 : totalPages}&take=${take}`);
  }

  return (
    <>
      {/* Filters */}
      <DiscoveryFilter page={page} query={query} take={take} />

      {/* Profiles */}
      {totalProfiles ? (
        <div className='flex flex-wrap items-center justify-center gap-4 p-4'>
          {profiles.map((profile) => (
            <DiscoveryProfile key={profile.id} profile={profile} />
          ))}
        </div>
      ) : (
        <DiscoveryNoResults />
      )}

      {/* Pagination */}
      <DiscoveryPagination displayedUsers={profiles.length} totalUsers={totalProfiles} totalPages={totalPages} take={take} page={page} query={query} />
    </>
  );
}
