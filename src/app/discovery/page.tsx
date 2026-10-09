import { Metadata } from 'next';
import { SearchParams } from 'next/dist/server/request/search-params';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { discoveryMetadata } from '@/constants/metadata';
import { getHeartStates } from '@/lib/hearts';
import { QUERIES } from '@/lib/queries';
import { getSession } from '@/lib/session';
import { STAGGER } from '@/lib/motion';

import { Eyebrow } from '@/components/common/heading';
import { DiscoveryFilter } from '@/components/discovery/filter';
import { DiscoveryNoResults } from '@/components/discovery/no-results';
import { DiscoveryPagination } from '@/components/discovery/pagination';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { CardHearts } from '@/components/hearts/card-hearts';
import { ScrollReveal } from '@/components/home/scroll-reveal';

const DISCOVERY_QUERY_TIMEOUT_MS = 8_000;

export const metadata: Metadata = discoveryMetadata;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Discovery query timed out')), timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timeoutId);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

const searchParamsSchema = z.object({
  q: z.preprocess((val) => val, z.string().optional().default('')),
  p: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(1)),
  t: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().default(6)),
  s: z.preprocess((val) => (isNaN(parseInt(val as string)) ? undefined : parseInt(val as string)), z.number().int().positive().optional()),
});

export default async function DiscoveryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q: query, p: page, t: take, s: seedParam } = searchParamsSchema.parse(await searchParams);
  // Arriving without a shuffle, e.g. from a bookmark: a fresh one, kept in the URL from here on. This renders once per
  // request on the server, so a random seed is what's meant; 1 and up, as `s` must be positive.
  if (!seedParam) {
    // eslint-disable-next-line react-hooks/purity
    const seed = 1 + Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1));
    const params = new URLSearchParams({ q: query, p: String(page), t: String(take), s: String(seed) });
    redirect(`/discovery?${params}`);
  }
  const seed = seedParam;

  const { profiles, totalProfiles } = await withTimeout(
    query?.length ? QUERIES.getProfilesWithQuery(query, page, take, seed) : QUERIES.getProfiles(page, take, seed),
    DISCOVERY_QUERY_TIMEOUT_MS,
  );

  // Where the viewer's sharks stand with each one on this page.
  const session = await getSession();
  const hearts = session
    ? await getHeartStates(
        session.user.id,
        profiles.map((profile) => profile.id),
      )
    : null;

  const totalPages = Math.ceil(totalProfiles / take);

  if (totalPages !== 0 && page > totalPages) {
    const params = new URLSearchParams({ q: query, p: String(totalPages < 1 ? 1 : totalPages), t: String(take), s: String(seed) });
    redirect(`/discovery?${params}`);
  }

  return (
    <section className='bg-card text-card-foreground w-full flex-1 px-4 pb-8 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <div className='-mt-8 mb-4'>
          <DiscoveryFilter page={page} query={query} seed={seed} take={take} />
        </div>
        {totalProfiles ? (
          <>
            <ScrollReveal id='profiles' className='scroll-m-40 py-6' delay={0.4}>
              <Eyebrow as='h2' className='mb-0'>
                Fresh possibilities
              </Eyebrow>
            </ScrollReveal>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              {profiles.map((profile, index) => (
                <ScrollReveal key={profile.id} className='h-full' delay={0.5 + index * STAGGER} scrollDelay={(index % 3) * STAGGER} variant='card'>
                  <DiscoveryProfile
                    profile={profile}
                    action={
                      <CardHearts
                        target={{ id: profile.id, displayName: profile.displayName }}
                        states={hearts?.[profile.id] ?? null}
                        signedIn={!!session}
                        own={profile.userId === session?.user.id}
                      />
                    }
                  />
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
  );
}
