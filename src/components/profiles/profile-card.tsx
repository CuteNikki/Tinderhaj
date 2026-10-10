'use client';

import { useState, useTransition } from 'react';

import { CakeIcon, CheckIcon, Link2Icon, MapPinIcon, PencilIcon, RulerIcon, SendIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import type { ProfileWithOwner } from '@/lib/queries';
import { deleteProfile, submitProfileForReview } from '@/lib/actions';
import { profileFieldLabel } from '@/lib/profile-fields';
import { PROFILE_STATUS_META } from '@/lib/profile-status';
import { LIFT } from '@/lib/motion';
import { calculateAge, cn } from '@/lib/utils';

import { useCopySharkLink } from '@/components/discovery/share-button';
import { ProfileAvatar, ProfileBanner } from '@/components/profiles/profile-image';
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

export function ProfileCard({ profile }: { profile: ProfileWithOwner }) {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const { copied, copy: copyLink } = useCopySharkLink(profile);

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
    <Card className={cn('group bg-background h-full w-full overflow-hidden pt-0 shadow-sm', LIFT)}>
      <div className='relative aspect-5/2 overflow-hidden'>
        <ProfileBanner src={profile.bannerUrl} alt={`${profile.displayName}'s banner`} />
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
            <ProfileAvatar src={profile.avatarUrl} alt={`${profile.displayName}'s avatar`} />
          </div>
          <div className='min-w-0 flex-1 pt-4'>
            <div className='flex flex-wrap items-center gap-x-2'>
              <h3 className='text-foreground max-w-full truncate text-xl font-black tracking-tight'>{profile.displayName}</h3>
              {profile.pronouns && <span className='text-muted-foreground text-sm'>({profile.pronouns})</span>}
            </div>
            <p className='text-muted-foreground truncate text-sm'>@{profile.user.username}</p>
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

        {profile.status === 'REJECTED' && (profile.rejectedFields.length > 0 || profile.rejectionNote) && (
          <div className='border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border p-3 text-sm'>
            {profile.rejectedFields.length > 0 && (
              <div className='flex flex-wrap items-center gap-1.5'>
                <span className='font-semibold'>Needs fixing:</span>
                {profile.rejectedFields.map((field) => (
                  <Badge key={field} variant='destructive' className='rounded-full text-xs font-semibold'>
                    {profileFieldLabel(field)}
                  </Badge>
                ))}
              </div>
            )}
            {profile.rejectionNote && (
              <p className={cn('leading-relaxed', profile.rejectedFields.length > 0 && 'mt-2')}>
                <span className='font-semibold'>Note:</span> {profile.rejectionNote}
              </p>
            )}
            <Link href='/guidelines' className='mt-2 inline-block font-semibold underline-offset-4 hover:underline'>
              What moderators look for
            </Link>
          </div>
        )}

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
          <Button variant='outline' size='sm' className='flex-1' asChild>
            <Link href={`/dashboard/profiles/${profile.id}/edit`}>
              <PencilIcon />
              Edit
            </Link>
          </Button>
          {/* Only a verified shark has a page of its own to share */}
          {profile.status === 'VERIFIED' && (
            <Button variant='outline' size='sm' className='flex-1' onClick={copyLink}>
              {copied ? <CheckIcon /> : <Link2Icon />}
              {copied ? 'Copied' : 'Share'}
            </Button>
          )}
          {profile.status === 'CREATED' && (
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
                <AlertDialogAction className={buttonVariants({ variant: 'destructive' })} onClick={handleDelete}>
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
