'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_USERNAME_LENGTH } from '@/constants/auth';
import { deleteAccount, updateUsername } from '@/lib/actions';
import { updateUsernameSchema } from '@/lib/schemas';

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
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2Icon, PencilLineIcon } from 'lucide-react';

export function AccountSettings({ username }: { username: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { username },
  });

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

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteAccount();

    if (result) {
      toast.error(result.message, { duration: 5000, position: 'top-center' });
      setIsDeleting(false);
    }
  }

  return (
    <div className='space-y-6'>
      <section className='border-foreground/10 bg-card rounded-xl border p-4 shadow-sm'>
        <div className='mb-4'>
          <h2 className='text-xl font-bold'>Username</h2>
          <p className='text-muted-foreground mt-1 text-sm'>Choose the name people will see across Tinderhaj.</p>
        </div>
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
            <Button type='submit' disabled={isSaving}>
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
      </section>

      <section className='border-destructive/30 bg-destructive/5 rounded-xl border p-4'>
        <div className='mb-2'>
          <h2 className='text-destructive text-xl font-bold'>Delete account</h2>
          <p className='text-muted-foreground mt-1 text-sm'>This permanently deletes your account, profiles, and sessions.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='destructive'>Delete account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. All of your profiles and account data will be permanently deleted.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60'
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
