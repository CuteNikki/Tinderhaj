'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { signIn } from '@/lib/actions';
import { signInSchema } from '@/lib/schemas';

import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';

export function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);

    const error = await signIn(data);

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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' autoComplete='email' maxLength={MAX_EMAIL_LENGTH} {...field} required />
                </FormControl>
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
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Link href='/forgot-password' className='text-muted-foreground hover:text-foreground text-xs transition-colors duration-150'>
                    Forgot password?
                  </Link>
                </div>
                <FormControl>
                  <Input type='password' autoComplete='current-password' maxLength={MAX_PASSWORD_LENGTH} {...field} required />
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
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRightIcon className='shrink-0' aria-hidden='true' />
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
