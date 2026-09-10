'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { signUp } from '@/lib/actions';
import { signUpSchema } from '@/lib/schemas';

import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true);

    const error = await signUp(data);

    if (error) {
      setIsSubmitting(false);

      if (error.field === 'email' || error.field === 'username') {
        form.setError(error.field, { message: error.message });
      }

      toast.error(error.message, { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' initial='hidden' animate='visible' variants={staggerContainer}>
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' autoComplete='username' {...field} required />
                </FormControl>
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
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' autoComplete='email' {...field} required />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' autoComplete='new-password' {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <Button type='submit' className='w-full transition-transform active:scale-[0.98]' disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  );
}
