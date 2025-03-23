import { User } from '@prisma/client';
import Image from 'next/image';

import { Cake, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';

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

export function ProfileCard({ profile, children, className }: { profile: User; children?: React.ReactNode; className?: string }) {
  return (
    <Card className={cn('w-72 overflow-hidden py-0', className)}>
      <Image unoptimized priority src={profile.bannerUrl} width={1144} height={572} alt='Banner' className='w-full' />

      <CardContent className='py-6'>
        <div className='border-background bg-muted relative -mt-16 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4'>
          <Image
            unoptimized
            priority
            src={`https://placehold.co/192x192/webp?text=${profile.displayName.charAt(0)}`}
            width={256}
            height={256}
            alt={`${profile.displayName}'s profile picture`}
            className='rounded-full object-cover'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='text-xl font-bold'>{profile.displayName}</h3>
              <p className='text-muted-foreground text-sm'>@{profile.username}</p>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <p className='text-muted-foreground text-xs'></p>
              <Cake className='text-muted-foreground h-4 w-4' />
              <span className='text-lg font-medium'>{calculateAge(profile.birthday)}</span>
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <Badge variant='outline'>{profile.pronouns}</Badge>
            <Badge variant='outline'>
              <MapPin /> {profile.location}
            </Badge>
          </div>

          <p className='text-sm'>{profile.bio}</p>

          <div className='flex flex-wrap gap-1 pt-2'>
            {profile.interests.map((interest, i) => (
              <Badge key={i} variant='secondary' className='text-xs'>
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
      <Skeleton className='w-full rounded-none h-[143px]' />

      <CardContent className='py-6'>
        <div className='border-background bg-muted relative -mt-16 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4'>
          <Skeleton className='h-full w-full rounded-full' />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <Skeleton className='h-7 w-24' />
              <Skeleton className='h-5 w-20' />
            </div>
            <div className='flex flex-row items-center gap-2'>
              <p className='text-muted-foreground text-xs'></p>
              <Skeleton className='h-7 w-10' />
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <Skeleton className='h-5.5 w-12' />
            <Skeleton className='h-5.5 w-12' />
          </div>

          <Skeleton className='h-15 w-full' />

          <div className='flex flex-wrap gap-1 pt-2'>
            {Array.from({ length: 3 }).map((interest, i) => (
              <Skeleton key={i} className='h-5.5 w-12' />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
