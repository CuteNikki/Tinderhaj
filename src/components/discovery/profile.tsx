import Link from 'next/link';

import { CakeIcon, MapPinIcon, RulerIcon } from 'lucide-react';

import { LIFT } from '@/lib/motion';
import { isFreshProfile, PROFILE_STATUS_META } from '@/lib/profile-status';
import type { PublicProfile } from '@/lib/queries';
import { calculateAge, cn } from '@/lib/utils';

import {
  ProfileAvatar,
  ProfileBanner,
} from '@/components/profiles/profile-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

/** How many cards a grid has in its first row at its widest: in view as a page opens, so their pictures load straight away (`eager`). */
export const FIRST_ROW = 3;

/**
 * A shark's card. `showStatus` shows where it is in review instead of whether
 * it's new, for moderators; `action` floats in the bottom-right corner, e.g. a
 * heart. `lift: false` keeps it still under the pointer, for a card that's a
 * popup of its own rather than one among many. `heading` is the level of its
 * name: h2 on pages where cards come straight under the page's title, rather
 * than under a section's. `eager` for one in view as the page opens, so its
 * pictures load straight away (see ProfileBanner).
 */
export function DiscoveryProfile({
  profile,
  showStatus = false,
  action,
  lift = true,
  heading: Heading = 'h3',
  eager = false,
}: {
  profile: PublicProfile;
  showStatus?: boolean;
  action?: React.ReactNode;
  lift?: boolean;
  heading?: 'h2' | 'h3';
  eager?: boolean;
}) {
  const status = PROFILE_STATUS_META[profile.status];

  return (
    <Card
      className={cn(
        'group h-full w-full overflow-hidden bg-background pt-0 pb-0 shadow-sm',
        lift && LIFT
      )}
    >
      <div className='relative aspect-5/2 overflow-hidden'>
        <ProfileBanner
          src={profile.bannerUrl}
          alt={`${profile.user.username}'s banner`}
          eager={eager}
        />
        {showStatus ? (
          <Badge
            className={cn(
              status.badgeClassName,
              'absolute top-3 right-3 rounded-full text-xs font-semibold shadow-md'
            )}
          >
            <status.icon aria-hidden='true' />
            {status.label}
          </Badge>
        ) : (
          isFreshProfile(profile.verifiedAt, profile.createdAt) && (
            // Solid in dark mode too, where the badge's own tint would otherwise win
            <Badge className='absolute top-3 right-3 rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-md dark:bg-primary'>
              New
            </Badge>
          )
        )}
      </div>

      <CardContent className='-mt-8 flex flex-1 flex-col px-4 pb-4 sm:px-6 sm:pb-6'>
        <div className='relative flex items-start gap-4'>
          <div className='relative shrink-0'>
            <div className='h-18 w-18 overflow-hidden rounded-full border-4 border-background bg-muted shadow-md'>
              <ProfileAvatar
                src={profile.avatarUrl}
                alt={`${profile.user.username}'s avatar`}
                eager={eager}
              />
            </div>
          </div>
          <div className='min-w-0 flex-1 pt-4'>
            <div className='flex flex-wrap items-center gap-x-2'>
              <Heading className='max-w-full truncate text-xl font-black tracking-tight text-foreground'>
                {profile.displayName}
              </Heading>
              {profile.pronouns && (
                <span className='text-sm text-muted-foreground'>
                  ({profile.pronouns})
                </span>
              )}
            </div>
            <p className='truncate text-sm text-muted-foreground'>
              <Link
                href={`/u/${profile.user.username}`}
                className='hover:text-foreground hover:underline'
              >
                @{profile.user.username}
              </Link>
            </p>
          </div>
        </div>
        <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground'>
          {profile.birthday && (
            <span className='flex items-center gap-1.5'>
              <CakeIcon className='h-3.5 w-3.5 text-primary' />
              {calculateAge(profile.birthday)} years old
            </span>
          )}
          {profile.location && (
            <span className='flex items-center gap-1.5'>
              <MapPinIcon className='h-3.5 w-3.5 text-primary' />
              {profile.location}
            </span>
          )}
          {profile.size != null && (
            <span className='flex items-center gap-1.5'>
              <RulerIcon className='h-3.5 w-3.5 text-primary' />
              {profile.size}
              {profile.unit.toLowerCase()}
            </span>
          )}
        </div>

        {profile.bio && (
          <p className='mt-4 line-clamp-3 text-sm leading-relaxed text-foreground/80'>
            {profile.bio}
          </p>
        )}

        <div className='flex flex-wrap gap-1.5 pt-4'>
          {profile.interests.map((interest) => (
            <Badge
              key={interest}
              variant='secondary'
              className='rounded-full text-xs font-semibold'
            >
              {interest}
            </Badge>
          ))}
        </div>
        {/* Pinned to the bottom, so it sits in the same corner on every card. */}
        {action && (
          <div className='mt-auto flex justify-end pt-3'>{action}</div>
        )}
      </CardContent>
    </Card>
  );
}
