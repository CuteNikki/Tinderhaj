'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MAX_USERNAME_LENGTH } from '@/constants/auth';
import { authClient } from '@/lib/auth-client';
import { signUpSchema } from '@/lib/schemas';

import { AuthInput } from '@/components/auth/auth-input';
import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';

export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);

    const { error } = await authClient.signUp.email({
      name: data.username,
      email: data.email,
      password: data.password,
      // Where the link in the verification email leads.
      callbackURL: '/verified',
    });

    if (error) {
      setIsSubmitting(false);

      const message = error.message ?? 'Unable to create account!';
      if (error.code === 'USERNAME_TAKEN' || error.code === 'INVALID_USERNAME') form.setError('username', { message });
      if (error.code?.startsWith('USER_ALREADY_EXISTS')) form.setError('email', { message: 'Email is already in use!' });

      toast.error(error.code?.startsWith('USER_ALREADY_EXISTS') ? 'Email is already in use!' : message, { duration: 5000, position: 'top-center' });
      return;
    }

    toast.success('Account created! Check your inbox to verify your email.', { duration: 5000, position: 'top-center' });
    router.push('/dashboard/profiles');
    router.refresh();
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2' initial='hidden' animate='visible' variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem className='gap-1.5'>
                <AuthInput label='Username' type='text' autoComplete='username' maxLength={MAX_USERNAME_LENGTH} {...field} required />
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='gap-1.5'>
                <AuthInput label='Password' type='password' autoComplete='new-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
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
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRightIcon className='shrink-0' aria-hidden='true' />
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
