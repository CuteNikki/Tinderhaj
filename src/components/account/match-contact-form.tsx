'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_MATCH_CONTACT_LENGTH } from '@/constants/auth';
import { updateMatchContact } from '@/lib/actions';
import { updateMatchContactSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function MatchContactForm({ contact }: { contact: string | null }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof updateMatchContactSchema>>({
    resolver: zodResolver(updateMatchContactSchema),
    defaultValues: { contact: contact ?? '' },
  });

  async function onSubmit(data: z.infer<typeof updateMatchContactSchema>) {
    setIsSaving(true);
    const result = await updateMatchContact(data);
    setIsSaving(false);

    if (result) return void toast.error(result.message, { duration: 5000, position: 'top-center' });

    form.reset({ contact: data.contact });
    toast.success(data.contact ? 'Your matches can see how to reach you.' : 'Your matches no longer see a way to reach you.', {
      duration: 5000,
      position: 'top-center',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2 sm:flex-row sm:items-end'>
        <FormField
          control={form.control}
          name='contact'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>How to reach you</FormLabel>
              <FormControl>
                <Input maxLength={MAX_MATCH_CONTACT_LENGTH} placeholder='e.g. Discord: nikki, or a link' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSaving || !form.formState.isDirty}>
          {isSaving ? (
            <>
              <Loader2Icon className='shrink-0 animate-spin' aria-hidden='true' />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className='shrink-0' aria-hidden='true' />
              Save
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
