import Link from 'next/link';

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

/**
 * The badge over the home page's title: in Tinderhaj's birthday week, a link
 * to the birthday page, else what the site is. The same size either way, so
 * nothing moves (see currentSeason).
 */
export async function SeasonBadge() {
  const { birthday } = await currentSeason();

  if (birthday)
    return (
      <HeroBadge icon={<Pulse />} className='relative hover:underline'>
        {/* The whole pill is the link */}
        <Link href='/birthday' className='after:absolute after:inset-0'>
          It&apos;s our {ordinal(birthday)} birthday! 🎂
        </Link>
      </HeroBadge>
    );

  return <HeroBadge icon={<Pulse />}>The plush dating club</HeroBadge>;
}
