import Link from 'next/link';

import type { SeasonBadgeKind } from '@/constants/seasons';

import { currentSeason } from '@/lib/season';

import { HeroBadge } from '@/components/common/hero-badge';

/** A dot that pulses, beside the badge's words. */
function Pulse() {
  return (
    <span className='relative flex h-2 w-2'>
      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75' />
      <span className='relative inline-flex h-2 w-2 rounded-full bg-primary' />
    </span>
  );
}

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`;
};

/** What each day's badge says, and where it leads, if anywhere. */
function news(
  kind: SeasonBadgeKind,
  birthday: number | null
): { text: string; href?: string } {
  switch (kind) {
    case 'birthday':
      return {
        text: `It's our ${ordinal(birthday ?? 1)} birthday! 🎂`,
        href: '/birthday',
      };
    case 'newYear':
      return { text: 'Happy New Year! 🎉' };
    case 'valentines':
      return { text: "Happy Valentine's Day 💘", href: '/discovery' };
    case 'trans':
      return { text: 'Trans Day of Visibility 🏳️‍⚧️' };
    case 'pride':
      return { text: 'Happy Pride! 🏳️‍🌈' };
    case 'halloween':
      return { text: 'Spooky season 🎃', href: '/discovery' };
    case 'holidays':
      return { text: 'Happy holidays ❄️' };
  }
}

/** The badge for a day's news, or what the site is when there's none. */
export function SeasonBadgeContent({
  badge,
  birthday,
}: {
  badge: SeasonBadgeKind | null;
  birthday: number | null;
}) {
  if (!badge)
    return <HeroBadge icon={<Pulse />}>The plush dating club</HeroBadge>;

  const { text, href } = news(badge, birthday);
  if (!href) return <HeroBadge icon={<Pulse />}>{text}</HeroBadge>;
  return (
    <HeroBadge icon={<Pulse />} className='relative hover:underline'>
      {/* The whole pill is the link */}
      <Link href={href} className='after:absolute after:inset-0'>
        {text}
      </Link>
    </HeroBadge>
  );
}

/**
 * The badge over the home page's title: the day's news in its season (see
 * seasonOn), sometimes a link, else what the site is. The same size either
 * way, so nothing moves.
 */
export async function SeasonBadge() {
  const { badge, birthday } = await currentSeason();
  return <SeasonBadgeContent badge={badge} birthday={birthday} />;
}
