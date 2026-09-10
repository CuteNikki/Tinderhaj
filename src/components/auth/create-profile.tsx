'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BLAHAJ_SIZE_CM, BLAHAJ_SIZE_INCH, MAX_BIO_LENGTH, MAX_INTEREST_LENGTH } from '@/constants/auth';
import { createProfile } from '@/lib/actions';
import { createProfileSchema } from '@/lib/schemas';

import { ImageUploadField } from '@/components/profiles/image-upload-field';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function CreateProfile({ disableButton }: { disableButton?: boolean }) {
  const [open, setOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');

  const form = useForm<z.input<typeof createProfileSchema>, unknown, z.output<typeof createProfileSchema>>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      bio: '',
      displayName: '',
      location: '',
      pronouns: '',
      size: 100,
      unit: 'CM',
      birthday: null,
      interests: [],
      avatarUrl: null,
      bannerUrl: null,
    },
  });

  const unit = form.watch('unit');

  function addInterest() {
    const value = newInterest.trim();
    if (!value || interests.length >= 3 || interests.includes(value)) return;

    setInterests([...interests, value]);
    setNewInterest('');
  }

  async function onSubmit(data: z.output<typeof createProfileSchema>) {
    const error = await createProfile({ ...data, interests });

    if (error) {
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    } else {
      form.reset();
      setInterests([]);
      setOpen(false);
      toast.success('Profile saved as a draft. Submit it for review when you\u2019re ready.', { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disableButton}>Create Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creating a new Profile</DialogTitle>
          <DialogDescription>It’ll be saved as a draft — submit it for review whenever you’re ready to go live.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='avatarUrl'
              render={({ field }) => (
                <FormItem>
                  <ImageUploadField label='Avatar' endpoint='profileAvatar' value={field.value ?? null} onChange={field.onChange} shape='circle' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bannerUrl'
              render={({ field }) => (
                <FormItem>
                  <ImageUploadField label='Banner' endpoint='profileBanner' value={field.value ?? null} onChange={field.onChange} shape='banner' />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='displayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Display Name <span className='text-destructive'>*</span>
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
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Bio</FormLabel>
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
                  <FormLabel>Birthday</FormLabel>
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
                  <FormLabel>Size</FormLabel>
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
                  <FormLabel>Pronouns</FormLabel>
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
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <div className='flex items-center justify-between'>
                <FormLabel>Interests</FormLabel>
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
                <Button onClick={() => form.reset()} variant='secondary'>
                  Cancel
                </Button>
              </DialogClose>
              <Button type='submit'>Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
