'use client';

import { useState, useTransition } from 'react';

import { BadgeCheckIcon, CakeIcon, MapPinIcon, RulerIcon, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Account, Profile } from '@/generated/client';
import { rejectProfile, verifyProfile } from '@/lib/actions';
import { PROFILE_FIELDS } from '@/lib/profile-fields';
import { calculateAge } from '@/lib/utils';

import { ProfileAvatar, ProfileBanner } from '@/components/profiles/profile-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export function VerifyProfileCard({ profile }: { profile: Profile & { account: Account } }) {
  const [isVerifying, startVerifyTransition] = useTransition();
  const [isRejecting, startRejectTransition] = useTransition();
  const [isHandled, setIsHandled] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectedFields, setRejectedFields] = useState<string[]>([]);
  const [note, setNote] = useState('');

  function toggleField(key: string) {
    setRejectedFields((current) => (current.includes(key) ? current.filter((field) => field !== key) : [...current, key]));
  }

  function handleVerify() {
    startVerifyTransition(async () => {
      const success = await verifyProfile({ profileId: profile.id });

      if (!success) {
        toast.error('Unable to verify this profile.', { duration: 5000, position: 'top-center' });
      } else {
        setIsHandled(true);
        toast.success(`"${profile.displayName}" verified!`, { duration: 4000, position: 'top-center' });
      }
    });
  }

  function handleReject() {
    startRejectTransition(async () => {
      const error = await rejectProfile({ profileId: profile.id, rejectedFields, note: note.trim() || undefined });

      if (error) {
        toast.error(error.message, { duration: 5000, position: 'top-center' });
      } else {
        setRejectOpen(false);
        setIsHandled(true);
        toast.success(`"${profile.displayName}" rejected.`, { duration: 4000, position: 'top-center' });
      }
    });
  }

  if (isHandled) return null;

  return (
    <Card className='border-foreground/10 bg-background h-full w-full overflow-hidden pt-0 shadow-sm'>
      <div className='relative aspect-5/2 overflow-hidden'>
        <ProfileBanner src={profile.bannerUrl} alt={`${profile.displayName}'s banner`} />
        <div className='from-background/70 absolute inset-0 bg-linear-to-t to-transparent' />
      </div>

      <CardContent className='-mt-8 px-4 pb-5 sm:px-6'>
        <div className='relative flex items-start gap-4'>
          <div className='border-background bg-muted h-18 w-18 shrink-0 overflow-hidden rounded-full border-4 shadow-md'>
            <ProfileAvatar src={profile.avatarUrl} alt={`${profile.displayName}'s avatar`} />
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
          <Button variant='default' size='sm' className='flex-1' onClick={handleVerify} disabled={isVerifying || isRejecting}>
            <BadgeCheckIcon />
            {isVerifying ? 'Verifying…' : 'Verify'}
          </Button>
          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger asChild>
              <Button variant='destructive' size='sm' className='flex-1' disabled={isVerifying || isRejecting}>
                <XCircleIcon />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject &quot;{profile.displayName}&quot;?</DialogTitle>
                <DialogDescription>Pick which fields need fixing and optionally leave a note. Nothing is changed except the status.</DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <p className='text-sm leading-none font-medium'>Fields that need fixing</p>
                  <div className='flex flex-wrap gap-1.5'>
                    {PROFILE_FIELDS.map((field) => (
                      <button key={field.key} type='button' onClick={() => toggleField(field.key)}>
                        <Badge
                          variant={rejectedFields.includes(field.key) ? 'destructive' : 'outline'}
                          className='cursor-pointer rounded-full px-3 py-1 text-xs font-semibold'
                        >
                          {field.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
                <div className='space-y-2'>
                  <p className='text-sm leading-none font-medium'>Note (optional)</p>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={300}
                    placeholder='e.g. Bio contains contact info, please remove.'
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='secondary'>Cancel</Button>
                </DialogClose>
                <Button variant='destructive' onClick={handleReject} disabled={isRejecting}>
                  {isRejecting ? 'Rejecting…' : 'Reject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
