'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants/auth';
import { authClient } from '@/lib/auth-client';
import type { SocialProviderId } from '@/lib/providers';
import { signInSchema } from '@/lib/schemas';

import { staggerContainer, staggerItem } from '@/components/auth/motion';
import { SocialButtons } from '@/components/auth/social-buttons';
import { SEND_CODE_KEY } from '@/components/auth/two-factor-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, FingerprintIcon, Loader2Icon } from 'lucide-react';

/** `error` says why signing in with a provider just failed. */
export function SignInForm({ providers, error }: { providers: SocialProviderId[]; error?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  /**
   * Signs in with a passkey. With `autoFill`, the browser offers saved
   * passkeys in the email field's suggestions instead of opening a prompt.
   */
  async function signInWithPasskey(autoFill = false) {
    const result = await authClient.signIn.passkey({ autoFill });
    const error = result?.error;

    if (!error) {
      router.push('/profiles');
      return router.refresh();
    }

    const code = 'code' in error ? error.code : undefined;
    // Closing the browser's prompt, or ignoring the suggestions, is fine.
    if (autoFill || code === 'AUTH_CANCELLED' || code?.startsWith('ERROR_')) return;

    toast.error(error.message ?? 'That passkey didn\u2019t work.', { duration: 5000, position: 'top-center' });
  }

  useEffect(() => {
    // Only where the browser can offer passkeys among the autofill
    // suggestions; elsewhere the button below opens its prompt.
    void window.PublicKeyCredential?.isConditionalMediationAvailable?.().then((available) => {
      if (available) void signInWithPasskey(true);
    });
    // Once, when the form shows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true);

    const { data: result, error } = await authClient.signIn.email(data);

    if (error) {
      setIsSubmitting(false);
      toast.error(error.status === 401 ? 'Unable to sign in!' : (error.message ?? 'Unable to sign in!'), { duration: 5000, position: 'top-center' });
      return;
    }

    // Two-step sign-in is on: the code comes next, on its own page.
    if (result && 'twoFactorRedirect' in result && result.twoFactorRedirect) {
      const methods = 'twoFactorMethods' in result && Array.isArray(result.twoFactorMethods) ? (result.twoFactorMethods as string[]) : [];
      try {
        sessionStorage.setItem(SEND_CODE_KEY, '1');
      } catch {
        // Without storage, the next page offers a button to send the code.
      }
      return router.push(`/two-factor?${new URLSearchParams({ methods: methods.join(',') })}`);
    }

    router.push('/profiles');
    router.refresh();
  }

  return (
    <Form {...form}>
      <motion.form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' initial='hidden' animate='visible' variants={staggerContainer}>
        {error && (
          <motion.p variants={staggerItem} role='alert' className='bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm text-pretty'>
            {error}
          </motion.p>
        )}
        <motion.div variants={staggerItem}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' autoComplete='email webauthn' maxLength={MAX_EMAIL_LENGTH} {...field} required />
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
        <motion.div variants={staggerItem} className='text-muted-foreground flex items-center gap-3 text-xs'>
          <span className='bg-border h-px flex-1' />
          or
          <span className='bg-border h-px flex-1' />
        </motion.div>
        <motion.div variants={staggerItem} className='space-y-2'>
          <Button type='button' variant='outline' className='w-full transition-transform active:scale-[0.98]' onClick={() => signInWithPasskey()}>
            <FingerprintIcon className='shrink-0' aria-hidden='true' />
            Sign in with a passkey
          </Button>
          <SocialButtons providers={providers} errorCallbackURL='/sign-in' />
        </motion.div>
      </motion.form>
    </Form>
  );
}
