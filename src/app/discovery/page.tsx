import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { QUERIES } from '@/lib/queries';

import { DiscoveryFilter } from '@/components/discovery/filter';
import { DiscoveryHero } from '@/components/discovery/hero';
import { DiscoveryNoResults } from '@/components/discovery/no-results';
import { DiscoveryPagination } from '@/components/discovery/pagination';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';

const searchParamsSchema = z.object({
  q: z.preprocess((val) => val, z.string().optional().default('')),
  p: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  t: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(6)),
  s: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().optional()),
});

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q: query, p: page, t: take, s: seedParam } = searchParamsSchema.parse(await searchParams);
  const seed = seedParam ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  if (!seedParam) {
    const params = new URLSearchParams({ q: query, p: String(page), t: String(take), s: String(seed) });
    redirect(`/discovery?${params}`);
  }

  const { profiles, totalProfiles } = await (query?.length ? QUERIES.getProfilesWithQuery(query, page, take, seed) : QUERIES.getProfiles(page, take, seed));

  const totalPages = Math.ceil(totalProfiles / take);

  if (totalPages !== 0 && page > totalPages) {
    const params = new URLSearchParams({ q: query, p: String(totalPages < 1 ? 1 : totalPages), t: String(take), s: String(seed) });
    redirect(`/discovery?${params}`);
  }

  return (
    <div className='bg-background flex flex-1 flex-col'>
      <DiscoveryHero />

      <section className='bg-card text-card-foreground w-full flex-1 pb-8'>
        <div className='container mx-auto max-w-7xl px-4 sm:px-5 lg:px-8'>
          <div className='-mt-8 mb-4'>
            <DiscoveryFilter page={page} query={query} seed={seed} take={take} />
          </div>
          {totalProfiles ? (
            <>
              <div id='profiles' className='flex scroll-m-40 flex-col justify-between gap-2 py-6 md:flex-row md:items-center'>
                <p className='text-primary text-xs font-bold tracking-widest uppercase'>Fresh possibilities</p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {profiles.map((profile, index) => (
                  <ScrollReveal key={profile.id} className='h-full' delay={index * 0.1}>
                    <DiscoveryProfile profile={profile} />
                  </ScrollReveal>
                ))}
              </div>
              <DiscoveryPagination
                displayedUsers={profiles.length}
                totalUsers={totalProfiles}
                totalPages={totalPages}
                take={take}
                page={page}
                query={query}
                seed={seed}
              />
            </>
          ) : (
            <DiscoveryNoResults />
          )}
        </div>
      </section>
    </div>
  );
}
