'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, MailCheckIcon, RotateCwIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_EMAIL_LENGTH } from '@/constants/auth';
import { authClient } from '@/lib/auth-client';
import { forgotPasswordSchema } from '@/lib/schemas';

import { AuthInput } from '@/components/auth/auth-input';
import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className='flex flex-col items-center gap-3 py-2 text-center'
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
          className='bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full'
        >
          <MailCheckIcon className='h-6 w-6' />
        </motion.div>
        <p className='text-muted-foreground text-sm'>If an account with that email exists, we&apos;ve sent a password reset link to it.</p>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2' initial='hidden' animate='visible' variants={staggerContainer}>
        <motion.div variants={staggerItem}>
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
        </motion.div>
        <motion.div variants={staggerItem}>
          <Button type='submit' className='w-full transition-transform active:scale-[0.98]' disabled={isSubmitting}>
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
        </motion.div>
      </motion.form>
    </Form>
  );
}
