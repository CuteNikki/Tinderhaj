import { CakeIcon, MapPinIcon, RulerIcon } from 'lucide-react';

import { calculateAge, cn } from '@/lib/utils';

import { ProfileAvatar, ProfileBanner } from '@/components/profiles/profile-image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function ProfilePreview({
  className,
  username,
  displayName,
  pronouns,
  avatarUrl,
  bannerUrl,
  bio,
  location,
  size,
  unit,
  birthday,
  interests,
}: {
  className?: string;
  username?: string;
  displayName: string;
  pronouns?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  size?: number | null;
  unit: 'CM' | 'INCH';
  birthday?: Date | null;
  interests: string[];
}) {
  return (
    <div className={cn('hidden w-72 shrink-0 lg:block', className)}>
      <p className='text-muted-foreground mb-2 text-xs font-bold tracking-widest uppercase'>Preview</p>
      <Card className='border-foreground/10 bg-background overflow-hidden pt-0 shadow-sm'>
        <div className='relative aspect-5/2 overflow-hidden'>
          <ProfileBanner src={bannerUrl ?? null} alt='Banner preview' />
          <div className='from-background/70 absolute inset-0 bg-linear-to-t to-transparent' />
        </div>

        <CardContent className='-mt-8 px-4 pb-5'>
          <div className='relative flex items-start gap-4'>
            <div className='relative shrink-0'>
              <div className='border-background bg-muted h-16 w-16 overflow-hidden rounded-full border-4 shadow-md'>
                <ProfileAvatar src={avatarUrl ?? null} alt='Avatar preview' size={64} />
              </div>
            </div>
            <div className='min-w-0 flex-1 pt-4'>
              <div className='flex flex-wrap items-center gap-x-2'>
                <h3 className='text-foreground max-w-full truncate text-lg font-black tracking-tight'>{displayName || 'Your name'}</h3>
                {pronouns && <span className='text-muted-foreground text-sm'>({pronouns})</span>}
              </div>
              {username && <p className='text-muted-foreground truncate text-sm'>@{username}</p>}
            </div>
          </div>
          <div className='text-muted-foreground mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm'>
            {birthday && (
              <span className='flex items-center gap-1.5'>
                <CakeIcon className='text-primary h-3.5 w-3.5' />
                {calculateAge(birthday)} years old
              </span>
            )}
            {location && (
              <span className='flex max-w-full min-w-0 items-center gap-1.5'>
                <MapPinIcon className='text-primary h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>{location}</span>
              </span>
            )}
            {size != null && (
              <span className='flex items-center gap-1.5'>
                <RulerIcon className='text-primary h-3.5 w-3.5' />
                {size}
                {unit.toLowerCase()}
              </span>
            )}
          </div>

          {bio && <p className='text-foreground/80 mt-4 line-clamp-3 text-sm leading-relaxed wrap-break-word'>{bio}</p>}

          {interests.length > 0 && (
            <div className='flex flex-wrap gap-1.5 pt-4'>
              {interests.map((interest) => (
                <Badge key={interest} variant='secondary' className='max-w-full rounded-full text-xs font-semibold'>
                  <span className='truncate'>{interest}</span>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
