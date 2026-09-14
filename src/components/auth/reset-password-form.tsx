'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { resetPassword } from '@/lib/actions';
import { resetPasswordSchema } from '@/lib/schemas';

import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2Icon, RotateCwIcon } from 'lucide-react';

export function ResetPasswordForm({ token }: { token: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: '', confirmPassword: '' },
  });

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    setIsSubmitting(true);

    const error = await resetPassword(data);

    if (error) {
      setIsSubmitting(false);
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' initial='hidden' animate='visible' variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type='password' autoComplete='new-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
                </FormControl>
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
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type='password' autoComplete='new-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
                </FormControl>
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
