'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { deleteProfile, updateProfile } from '@/lib/actions';
import { updateProfileSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ProfileForm({ profile }: { profile?: z.infer<typeof updateProfileSchema> }) {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profile,
  });

  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    const error = await updateProfile(data);

    if (error) {
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    } else {
      toast.success('Profile updated successfully!', { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-md space-y-4'>
        <FormField
          control={form.control}
          name='displayName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
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
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
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
              <FormLabel>Size (in cm)</FormLabel>
              <FormControl>
                <Input type='number' {...field} onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
              </FormControl>
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
        <div className='flex flex-col items-center justify-between gap-4 text-pretty sm:flex-row sm:gap-8'>
          <div className='flex flex-wrap gap-2'>
            <Button variant='secondary' type='reset' onClick={() => form.reset(profile)}>
              Reset Changes
            </Button>
            <Button type='submit'>Save Changes</Button>
            <Button
              type='button'
              variant='destructive'
              onClick={async () => {
                const error = await deleteProfile({ profileId: profile!.id });

                if (error) {
                  toast.error(error.message, { duration: 5000, position: 'top-center' });
                } else {
                  toast.success('Profile deleted successfully!', { duration: 5000, position: 'top-center' });
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
