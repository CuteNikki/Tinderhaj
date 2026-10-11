'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, MailCheckIcon, RotateCwIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_EMAIL_LENGTH } from '@/constants/auth';
import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from '@/lib/schemas';

import { AuthInput } from '@/components/auth/auth-input';
import { fieldDelay } from '@/components/auth/motion';
import { Enter } from '@/components/common/enter';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const filled = !!useWatch({ control: form.control, name: 'email' }).trim();

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    setIsSubmitting(true);

    // The answer is the same whether or not the email has an account.
    const { error } = await authClient.requestPasswordReset({ email: data.email, redirectTo: '/reset-password' });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message ?? 'Unable to process request!', { duration: 5000, position: 'top-center' });
      return;
    }

    setIsSent(true);
    toast.success('If an account with that email exists, a password reset link has been sent.', { duration: 6000, position: 'top-center' });
  }

  if (isSent) {
    return (
      <Enter variant='reveal' className='flex flex-col items-center gap-3 py-2 text-center'>
        <Enter variant='pop' delay={0.1} className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full'>
          <MailCheckIcon className='h-6 w-6' />
        </Enter>
        <p className='text-muted-foreground text-sm'>If an account with that email exists, we&apos;ve sent a password reset link to it.</p>
      </Enter>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <Enter variant='reveal' spring='pop' delay={fieldDelay(0)}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='gap-1.5'>
                <AuthInput label='Email' type='email' autoComplete='email' maxLength={MAX_EMAIL_LENGTH} {...field} required />
                <FormMessage />
              </FormItem>
            )}
          />
        </Enter>
        <Enter variant='reveal' spring='pop' delay={fieldDelay(1)}>
          <Button type='submit' className='w-full' disabled={isSubmitting || !filled}>
            {isSubmitting ? (
              <>
                <Loader2Icon className='shrink-0 animate-spin' aria-hidden='true' />
                Sending...
              </>
            ) : (
              <>
                <RotateCwIcon className='shrink-0' aria-hidden='true' />
                Reset password
              </>
            )}
          </Button>
        </Enter>
      </form>
    </Form>
  );
}
