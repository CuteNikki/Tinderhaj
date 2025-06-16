'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { signUp } from '@/lib/actions';
import { signUpSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function SignUpForm() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const error = await signUp(data);

    if (!error.field) {
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    } else {
      form.setError(error.field as 'username' | 'email' | 'password', { message: error.message });
    }
  }

  return (
    <Card className='gap-6'>
      <CardHeader className='text-center'>
        <CardTitle className='pt-2 text-xl font-bold'>Welcome to Tinderhaj</CardTitle>
        <CardDescription className='text-pretty'>Enter your details below to create an account</CardDescription>
      </CardHeader>
      <CardContent className='text-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='text-start'>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='text-start'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='text-start'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Sign Up
            </Button>
            <span className='text-sm'>
              {'Already have an account? '}
              <Link href='/sign-in' className='underline'>
                Sign In
              </Link>
            </span>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
