import Link from 'next/link';
import { notFound } from 'next/navigation';

import { seasonOn } from '@/constants/seasons';

import { cn } from '@/lib/utils';

import { Hero } from '@/components/home/hero';
import { ProfileCount } from '@/components/home/profile-count';
import { SeasonBadgeContent } from '@/components/home/season-badge';
import { SeasonEffects } from '@/components/season/season-effects';

/** A day in each season, to try it out on. */
const DAYS = {
  none: { label: 'None', date: '2027-09-10T12:00:00Z' },
  snow: { label: 'December', date: '2026-12-10T12:00:00Z' },
  birthday: { label: 'Birthday week', date: '2026-12-24T12:00:00Z' },
  newYear: { label: 'New Year', date: '2027-01-01T12:00:00Z' },
  valentines: { label: "Valentine's", date: '2027-02-14T12:00:00Z' },
  trans: { label: 'Trans Day of Visibility', date: '2027-03-31T12:00:00Z' },
  pride: { label: 'Pride', date: '2027-06-15T12:00:00Z' },
  halloween: { label: 'Halloween', date: '2027-10-31T12:00:00Z' },
} as const;

type Day = keyof typeof DAYS;

/**
 * Only while developing: the home page's water as it looks in each season,
 * picked from the bar at the top, to see them without changing the date.
 */
export default async function SeasonsPreview({
  searchParams,
}: PageProps<'/dev/seasons'>) {
  if (process.env.NODE_ENV !== 'development') notFound();

  const { season: param } = await searchParams;
  const day: Day =
    typeof param === 'string' && param in DAYS ? (param as Day) : 'snow';
  const season = seasonOn(new Date(DAYS[day].date));

  return (
    <>
      <nav
        aria-label='Seasons'
        className='fixed top-20 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 flex-wrap justify-center gap-1 rounded-2xl bg-background/90 p-1 shadow-lg ring-1 ring-foreground/10 backdrop-blur'
      >
        {(Object.keys(DAYS) as Day[]).map((key) => (
          <Link
            key={key}
            href={`/dev/seasons?season=${key}`}
            aria-current={key === day ? 'page' : undefined}
            className={cn(
              'rounded-xl px-3 py-1.5 text-sm font-medium',
              key === day
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {DAYS[key].label}
          </Link>
        ))}
      </nav>
      <Hero
        profileCount={<ProfileCount />}
        badge={
          <SeasonBadgeContent badge={season.badge} birthday={season.birthday} />
        }
        effects={
          season.effect && (
            <SeasonEffects key={season.effect} effect={season.effect} />
          )
        }
      />
    </>
  );
}
