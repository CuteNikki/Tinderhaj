'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_USERNAME_LENGTH } from '@/constants/auth';
import { updateUsername } from '@/lib/actions';
import { updateUsernameSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2Icon, PencilLineIcon } from 'lucide-react';

export function UsernameForm({ username }: { username: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { username },
  });
  const typed = useWatch({ control: form.control, name: 'username' }).trim();

  async function onSubmit(data: z.infer<typeof updateUsernameSchema>) {
    setIsSaving(true);
    const result = await updateUsername(data);

    if (result) {
      if (result.field === 'username') form.setError('username', { message: result.message });
      toast.error(result.message, { duration: 5000, position: 'top-center' });
      setIsSaving(false);
      return;
    }

    toast.success('Username updated.', { duration: 5000, position: 'top-center' });
    setIsSaving(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2 sm:flex-row sm:items-end'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoComplete='username' maxLength={MAX_USERNAME_LENGTH} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSaving || !typed || typed === username}>
          {isSaving ? (
            <>
              <Loader2Icon className='shrink-0 animate-spin' aria-hidden='true' />
              Updating...
            </>
          ) : (
            <>
              <PencilLineIcon className='shrink-0' aria-hidden='true' />
              Change
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
