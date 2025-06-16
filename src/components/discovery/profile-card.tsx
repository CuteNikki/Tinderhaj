import { Account, Profile } from '@prisma/client';
import Image from 'next/image';

import { Cake, MapPin, Ruler } from 'lucide-react';

import { cn } from '@/lib/utils';

import { TypographyH4, TypographyMuted } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Calculate age from date of birth
function calculateAge(dob: Date) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred yet this year, subtract one year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function ProfileCard({ profile, children, className }: { profile: Profile & { Account: Account }; children?: React.ReactNode; className?: string, fitHeight?: boolean }) {
  return (
    <Card className={cn('w-72 overflow-hidden py-0', className)}>
      <Image unoptimized priority draggable={false} width={1144} height={572} src={profile.bannerUrl} alt='Banner' className='w-full select-none' />

      <CardContent className='py-6'>
        <div className='border-background bg-muted relative -mt-16 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4'>
          <Image
            unoptimized
            priority
            draggable={false}
            width={256}
            height={256}
            src={profile.avatarUrl}
            alt={`${profile.displayName}'s profile picture`}
            className='rounded-full object-cover select-none'
          />
        </div>

        <div className='space-y-2'>
          <div>
            <TypographyH4 className='truncate text-xl font-bold'>{profile.displayName}</TypographyH4>
            <TypographyMuted className='text-sm'>@{profile.Account.username}</TypographyMuted>
          </div>

          <div className='flex items-center gap-1'>
            <Badge variant='outline'>
              <span className='max-w-16 truncate'>{profile.pronouns}</span>
            </Badge>
            <Badge variant='outline'>
              <Cake />
              {calculateAge(profile.birthday)}yo
            </Badge>
            <Badge variant='outline'>
              <Ruler /> {profile.size}cm
            </Badge>
          </div>
          <div className='flex items-center gap-1'>
            <Badge variant='outline'>
              <MapPin />
              <span className='max-w-28 truncate'>{profile.location}</span>
            </Badge>
          </div>

          <p className='truncate text-sm whitespace-pre-line'>{profile.bio}</p>

          <div className='flex flex-wrap gap-1 pt-2'>
            {profile.interests.map((interest, index) => (
              <Badge key={`profile-card-interest-${index}-${profile.id}`} variant='secondary' className='text-xs'>
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      {children}
    </Card>
  );
}

export function ProfileCardSkeleton() {
  return (
    <Card className='w-72 overflow-hidden py-0'>
      <Skeleton className='h-[143px] w-full rounded-none' />

      <CardContent className='py-6'>
        <div className='border-background bg-muted relative -mt-16 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4'>
          <Skeleton className='h-full w-full rounded-full' />
        </div>

        <div className='space-y-2'>
          <div>
            <Skeleton className='h-7 w-32' />
            <Skeleton className='h-5 w-24' />
          </div>

          <div className='flex items-center gap-1'>
            <Skeleton className='h-5.5 w-12' />
            <Skeleton className='h-5.5 w-12' />
            <Skeleton className='h-5.5 w-12' />
          </div>

          <div className='flex items-center gap-1'>
            <Skeleton className='h-5.5 w-24' />
          </div>

          <Skeleton className='h-15 w-full' />

          <div className='flex flex-wrap gap-1 pt-2'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`profile-card-interest-skeleton-${index}`} className='h-5.5 w-12' />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
