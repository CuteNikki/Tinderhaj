'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';

import { CakeIcon, MapPinIcon, RulerIcon, SendIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Account, Profile } from '@/generated/client';
import { deleteProfile, submitProfileForReview } from '@/lib/actions';
import { PROFILE_STATUS_META } from '@/lib/profile-status';
import { calculateAge, cn } from '@/lib/utils';

import { EditProfile } from '@/components/profiles/edit-profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ProfileCard({ profile }: { profile: Profile & { account: Account } }) {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);

  const StatusIcon = PROFILE_STATUS_META[profile.status].icon;

  function handleDelete() {
    startDeleteTransition(async () => {
      const error = await deleteProfile({ profileId: profile.id });

      if (error) {
        toast.error(error.message, { duration: 5000, position: 'top-center' });
      } else {
        setIsDeleted(true);
        toast.success('Profile deleted.', { duration: 4000, position: 'top-center' });
      }
    });
  }

  function handleSubmitForReview() {
    startSubmitTransition(async () => {
      const error = await submitProfileForReview({ profileId: profile.id });

      if (error) {
        toast.error(error.message, { duration: 5000, position: 'top-center' });
      } else {
        toast.success('Submitted for review!', { duration: 4000, position: 'top-center' });
      }
    });
  }

  if (isDeleted) return null;

  return (
    <Card className='group border-foreground/10 bg-background h-full w-full overflow-hidden pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <div className='relative aspect-5/2 overflow-hidden'>
        <Image
          unoptimized
          src={profile.bannerUrl || 'https://placehold.co/1144x572'}
          alt={`${profile.displayName}'s banner`}
          loading='eager'
          fill
          className='object-cover'
        />
        <div className='from-background/70 absolute inset-0 bg-linear-to-t to-transparent' />
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={cn('absolute top-3 right-3 gap-1 rounded-full font-semibold shadow-sm', PROFILE_STATUS_META[profile.status].badgeClassName)}>
              <StatusIcon className='h-3 w-3' />
              {PROFILE_STATUS_META[profile.status].label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{PROFILE_STATUS_META[profile.status].description}</TooltipContent>
        </Tooltip>
      </div>

      <CardContent className='-mt-8 px-4 pb-5 sm:px-6'>
        <div className='relative flex items-start gap-4'>
          <div className='border-background bg-muted h-18 w-18 shrink-0 overflow-hidden rounded-full border-4 shadow-md'>
            <Image
              unoptimized
              src={profile.avatarUrl || 'https://placehold.co/512x512'}
              alt={`${profile.displayName}'s avatar`}
              loading='eager'
              width={72}
              height={72}
              className='object-cover'
            />
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
          <span className='flex items-center gap-1.5'>
            <RulerIcon className='text-primary h-3.5 w-3.5' />
            {profile.size}
            {profile.unit.toLowerCase()}
          </span>
        </div>

        {profile.bio && <p className='text-foreground/80 mt-4 line-clamp-3 text-sm leading-relaxed'>{profile.bio}</p>}

        {profile.interests.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-1.5'>
            {profile.interests.map((interest) => (
              <Badge key={interest} variant='secondary' className='rounded-full text-xs font-semibold'>
                {interest}
              </Badge>
            ))}
          </div>
        )}

        <div className='mt-4 flex gap-2'>
          <EditProfile profile={profile} />
          {(profile.status === 'CREATED' || profile.status === 'REJECTED') && (
            <Button variant='outline' size='sm' className='flex-1' onClick={handleSubmitForReview} disabled={isSubmitting || isDeleting}>
              <SendIcon />
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' size='sm' className='flex-1' disabled={isDeleting || isSubmitting}>
                <Trash2Icon />
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{profile.displayName}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone. The profile will be permanently deleted.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className={cn(buttonVariants({ variant: 'destructive' }))} onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
