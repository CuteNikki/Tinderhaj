import { CakeIcon, MapPinIcon, RulerIcon } from 'lucide-react';

import { Account, Profile } from '@/generated/client';

import { calculateAge } from '@/lib/utils';

import { ProfileAvatar, ProfileBanner } from '@/components/profiles/profile-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function DiscoveryProfile({ profile }: { profile: Profile & { account: Account } }) {
  return (
    <Card className='group border-foreground/10 bg-background h-full w-full overflow-hidden pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <div className='relative aspect-5/2 overflow-hidden'>
        <ProfileBanner src={profile.bannerUrl} alt={`${profile.account.username}'s banner`} />
        <div className='from-background/70 absolute inset-0 bg-linear-to-t to-transparent' />
      </div>

      <CardContent className='-mt-8 px-4 pb-5 sm:px-6'>
        <div className='relative flex items-start gap-4'>
          <div className='relative shrink-0'>
            <div className='border-background bg-muted h-18 w-18 overflow-hidden rounded-full border-4 shadow-md'>
              <ProfileAvatar src={profile.avatarUrl} alt={`${profile.account.username}'s avatar`} />
            </div>
          </div>
          <div className='min-w-0 flex-1 pt-4'>
            <div className='flex flex-wrap items-center gap-x-2'>
              <h3 className='text-foreground truncate text-xl font-black tracking-tight'>{profile.displayName}</h3>
              {profile.pronouns && <span className='text-muted-foreground text-sm'>({profile.pronouns})</span>}
            </div>
            <p className='text-muted-foreground truncate text-sm'>@{profile.account.username}</p>
          </div>
        </div>
        <div className='text-muted-foreground mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
          {profile.birthday && (
            <span className='flex items-center gap-1.5'>
              <CakeIcon className='text-primary h-3.5 w-3.5' />
              {calculateAge(profile.birthday)} years old
            </span>
          )}
          {profile.location && (
            <span className='flex items-center gap-1.5'>
              <MapPinIcon className='text-primary h-3.5 w-3.5' />
              {profile.location}
            </span>
          )}
          {profile.size != null && (
            <span className='flex items-center gap-1.5'>
              <RulerIcon className='text-primary h-3.5 w-3.5' />
              {profile.size}
              {profile.unit.toLowerCase()}
            </span>
          )}
        </div>

        {profile.bio && <p className='text-foreground/80 mt-4 line-clamp-3 text-sm leading-relaxed'>{profile.bio}</p>}

        <div className='flex flex-wrap gap-1.5 pt-4'>
          {profile.interests.map((interest) => (
            <Badge key={interest} variant='secondary' className='rounded-full text-xs font-semibold'>
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
