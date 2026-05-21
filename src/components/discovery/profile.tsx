import Image from 'next/image';

import { CakeIcon, MapPinIcon, RulerIcon } from 'lucide-react';

import { Account, Profile } from '@/generated/client';

import { calculateAge } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function DiscoveryProfile({ profile }: { profile: Profile & { account: Account } }) {
  return (
    <Card className='w-full max-w-sm pt-0'>
      <div className='relative aspect-3/1 overflow-hidden'>
        <Image
          unoptimized
          src={profile.bannerUrl || '/default-banner.png'}
          alt={`${profile.account.username}'s banner`}
          loading='eager'
          fill
          className='object-cover'
        />
        <div className='from-card/50 absolute inset-0 bg-linear-to-t to-transparent' />
      </div>

      <CardContent>
        {/* Info Row */}
        <div className='flex items-center gap-4'>
          {/* Avatar */}
          <div className='relative shrink-0'>
            <div className='h-16 w-16 overflow-hidden rounded-full border-2'>
              <Image
                unoptimized
                src={profile.avatarUrl || '/default-avatar.png'}
                alt={`${profile.account.username}'s avatar`}
                loading='eager'
                width={64}
                height={64}
                className='object-cover'
              />
            </div>
          </div>
          {/* Name & Details */}
          <div className='min-w-0 flex-1'>
            <div className='flex flex-wrap items-center space-x-2'>
              <h3 className='text-foreground truncate text-lg font-semibold'>{profile.displayName}</h3>
              <span>({profile.pronouns})</span>
            </div>
            <p className='text-muted-foreground truncate text-sm'>@{profile.account.username}</p>
          </div>
        </div>
        {/* Location and Size */}
        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-sm'>
          <span className='flex items-center gap-1'>
            <CakeIcon className='h-3.5 w-3.5' />
            {calculateAge(profile.birthday)} years old
          </span>
          <span className='flex items-center gap-1'>
            <MapPinIcon className='h-3.5 w-3.5' />
            {profile.location}
          </span>
          <span className='flex items-center gap-1'>
            <RulerIcon className='h-3.5 w-3.5' />
            {profile.size}
            {profile.unit.toLowerCase()}
          </span>
        </div>

        {/* Bio */}
        <p className='text-muted-foreground line-clamp-2 text-sm'>{profile.bio}</p>

        {/* Interests */}
        <div className='flex flex-wrap gap-1.5 pt-4'>
          {profile.interests.map((interest) => (
            <Badge key={interest} variant='secondary' className='text-xs font-normal'>
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
