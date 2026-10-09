'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { authClient } from '@/lib/auth-client';
import { resetPasswordSchema } from '@/lib/schemas';

import { AuthInput } from '@/components/auth/auth-input';
import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Loader2Icon, RotateCwIcon } from 'lucide-react';

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setIsSubmitting(true);

    // Also signs out everywhere (see lib/auth.ts).
    const { error } = await authClient.resetPassword({ newPassword: data.password, token: data.token });

    if (error) {
      setIsSubmitting(false);
      toast.error(error.code === 'INVALID_TOKEN' ? 'This reset link is invalid or has expired!' : (error.message ?? 'Unable to reset password!'), {
        duration: 5000,
        position: 'top-center',
      });
      return;
    }

    toast.success('Password changed. Sign in with your new password.', { duration: 5000, position: 'top-center' });
    router.push('/sign-in');
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2' initial='hidden' animate='visible' variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='gap-1.5'>
                <AuthInput label='New password' type='password' autoComplete='new-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='gap-1.5'>
                <AuthInput label='Confirm new password' type='password' autoComplete='new-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className='shrink-0 animate-spin' aria-hidden='true' />
                Resetting...
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
