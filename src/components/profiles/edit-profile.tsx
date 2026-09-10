'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon, PlusIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BLAHAJ_SIZE_CM, BLAHAJ_SIZE_INCH, MAX_BIO_LENGTH, MAX_INTEREST_LENGTH } from '@/constants/auth';
import { Account, Profile } from '@/generated/client';
import { updateProfile } from '@/lib/actions';
import { profileFieldLabel } from '@/lib/profile-fields';
import { updateProfileSchema } from '@/lib/schemas';

import { ImageUploadField } from '@/components/profiles/image-upload-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function EditProfile({ profile }: { profile: Profile & { account: Account } }) {
  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [newInterest, setNewInterest] = useState('');

  const form = useForm<z.input<typeof updateProfileSchema>, unknown, z.output<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      id: profile.id,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl ?? null,
      bannerUrl: profile.bannerUrl ?? null,
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      pronouns: profile.pronouns ?? '',
      size: profile.size,
      unit: profile.unit,
      birthday: profile.birthday,
      interests: profile.interests,
    },
  });

  const unit = form.watch('unit');

  function isFlagged(key: string) {
    return profile.status === 'REJECTED' && profile.rejectedFields.includes(key);
  }

  function addInterest() {
    const value = newInterest.trim();
    if (!value || interests.length >= 3 || interests.includes(value)) return;

    setInterests([...interests, value]);
    setNewInterest('');
  }

  async function onSubmit(data: z.output<typeof updateProfileSchema>) {
    const error = await updateProfile({ ...data, interests });

    if (error) {
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    } else {
      setOpen(false);
      toast.success('Profile saved as a draft. Submit it for review when you\u2019re ready.', { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='flex-1'>
          <PencilIcon />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editing &quot;{profile.displayName}&quot;</DialogTitle>
          <DialogDescription>Changes are saved as a draft — you&apos;ll need to submit it for review again before it shows up in discovery.</DialogDescription>
        </DialogHeader>

        {profile.status === 'VERIFIED' && (
          <div className='flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400'>
            <TriangleAlertIcon className='mt-0.5 h-4 w-4 shrink-0' />
            <p>
              This profile is currently verified and live in discovery. Saving any changes will pull it from discovery until you resubmit and it&apos;s
              re-verified.
            </p>
          </div>
        )}

        {profile.status === 'REJECTED' && (profile.rejectedFields.length > 0 || profile.rejectionNote) && (
          <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-md border p-3 text-sm'>
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
              <p className={profile.rejectedFields.length > 0 ? 'mt-2 leading-relaxed' : 'leading-relaxed'}>
                <span className='font-semibold'>Note:</span> {profile.rejectionNote}
              </p>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Display Name <span className='text-destructive'>*</span>
                    {isFlagged('displayName') && (
                      <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                        Needs update
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type='text' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='avatarUrl'
              render={({ field }) => (
                <FormItem>
                  <ImageUploadField
                    label='Avatar'
                    flagged={isFlagged('avatarUrl')}
                    endpoint='profileAvatar'
                    value={field.value ?? null}
                    onChange={field.onChange}
                    shape='circle'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bannerUrl'
              render={({ field }) => (
                <FormItem>
                  <ImageUploadField
                    label='Banner'
                    flagged={isFlagged('bannerUrl')}
                    endpoint='profileBanner'
                    value={field.value ?? null}
                    onChange={field.onChange}
                    shape='banner'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>
                      Bio
                      {isFlagged('bio') && (
                        <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                          Needs update
                        </Badge>
                      )}
                    </FormLabel>
                    <span className='text-muted-foreground text-xs'>
                      {(field.value ?? '').length}/{MAX_BIO_LENGTH}
                    </span>
                  </div>
                  <FormControl>
                    <Textarea maxLength={MAX_BIO_LENGTH} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='birthday'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Birthday
                    {isFlagged('birthday') && (
                      <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                        Needs update
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='date'
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='size'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Size
                    {isFlagged('size') && (
                      <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                        Needs update
                      </Badge>
                    )}
                  </FormLabel>
                  <div className='flex items-center gap-2'>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormField
                      control={form.control}
                      name='unit'
                      render={({ field: unitField }) => (
                        <Select value={unitField.value} onValueChange={unitField.onChange}>
                          <SelectTrigger className='w-24'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='CM'>cm</SelectItem>
                            <SelectItem value='INCH'>inch</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    IKEA BLÅHAJ sizes: Small {unit === 'INCH' ? BLAHAJ_SIZE_INCH.small : BLAHAJ_SIZE_CM.small}
                    {unit === 'INCH' ? ' inches' : 'cm'}, Large {unit === 'INCH' ? BLAHAJ_SIZE_INCH.large : BLAHAJ_SIZE_CM.large}
                    {unit === 'INCH' ? ' inches' : 'cm'}.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pronouns'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pronouns
                    {isFlagged('pronouns') && (
                      <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                        Needs update
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location
                    {isFlagged('location') && (
                      <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                        Needs update
                      </Badge>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>
                  Interests
                  {isFlagged('interests') && (
                    <Badge variant='destructive' className='rounded-full text-[10px] font-semibold'>
                      Needs update
                    </Badge>
                  )}
                </FormLabel>
                <span className='text-muted-foreground text-xs'>{interests.length}/3</span>
              </div>
              {interests.length > 0 && (
                <div className='flex flex-wrap gap-1.5'>
                  {interests.map((interest) => (
                    <Badge key={interest} variant='secondary' className='gap-1 rounded-full py-1 pr-1 pl-2.5 text-xs font-semibold'>
                      {interest}
                      <button
                        type='button'
                        onClick={() => setInterests(interests.filter((i) => i !== interest))}
                        className='hover:bg-foreground/10 rounded-full p-0.5'
                      >
                        <XIcon className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {interests.length < 3 && (
                <div className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={newInterest}
                    maxLength={MAX_INTEREST_LENGTH}
                    placeholder='e.g. Cuddles'
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                  <Button type='button' variant='outline' size='icon' onClick={addInterest} disabled={!newInterest.trim()}>
                    <PlusIcon />
                  </Button>
                </div>
              )}
            </FormItem>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
