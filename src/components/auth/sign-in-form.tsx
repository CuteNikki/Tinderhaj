'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { signIn } from '@/lib/actions';
import { signInSchema } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function SignInForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);

    if (error) {
      toast.error(error.message, { duration: 5000, position: 'top-center' });
    }
  }

  return (
    <Card className='gap-6'>
      <CardHeader className='text-center'>
        <CardTitle className='pt-2 text-xl font-bold'>Welcome back</CardTitle>
        <CardDescription className='text-pretty'>Enter your details below to sign in to your account</CardDescription>
      </CardHeader>
      <CardContent className='text-center'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link href='/password-reset' className='text-muted-foreground text-sm'>
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type='password' {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Sign In
            </Button>
            <span className='text-sm'>
              {"Don't have an account? "}
              <Link href='/sign-up' className='underline'>
                Sign Up
              </Link>
            </span>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
