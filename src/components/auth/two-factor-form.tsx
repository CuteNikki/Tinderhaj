'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import { KeyRoundIcon, Loader2Icon, MailIcon, SmartphoneIcon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { CodeInput } from '@/components/common/code-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'app' | 'email' | 'backup';

/**
 * Left in the tab by the sign-in form when it sends someone here, so the
 * email code goes out once per sign-in, not on every reload of this page.
 */
export const SEND_CODE_KEY = 'two-factor-send-code';

const messages: Record<string, string> = {
  INVALID_CODE: 'That code didn’t work. Try again.',
  INVALID_BACKUP_CODE: 'That backup code didn’t work, or was used already.',
  OTP_HAS_EXPIRED: 'That code has expired. Send a new one.',
  TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: 'Too many tries with that code. Send a new one.',
  ACCOUNT_TEMPORARILY_LOCKED: 'Too many wrong codes. Wait 15 minutes, then sign in again.',
};

/**
 * The second step of signing in with a password: a code from an
 * authenticator app, by email, or a backup code. `hasApp` says whether an
 * app is set up; email codes always work.
 */
export function TwoFactorForm({ hasApp }: { hasApp: boolean }) {
  const router = useRouter();
  const id = useId();
  const [mode, setMode] = useState<Mode>(hasApp ? 'app' : 'email');
  const [error, setError] = useState<string>();
  const [expired, setExpired] = useState(false);
  const [pending, setPending] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [trust, setTrust] = useState(false);
  const autoSent = useRef(false);

  async function sendCode() {
    setSending(true);
    setError(undefined);
    const { error } = await authClient.twoFactor.sendOtp();
    setSending(false);
    if (error) return fail(error);
    setSent(true);
    toast.success('Code sent. Check your email.', { duration: 5000, position: 'top-center' });
  }

  function fail(error: { code?: string; message?: string }) {
    if (error.code === 'INVALID_TWO_FACTOR_COOKIE') return setExpired(true);
    setError((error.code && messages[error.code]) ?? error.message ?? 'Something went wrong');
  }

  useEffect(() => {
    // Without an app, the code comes by email: send it right away, once per
    // sign-in. Reloading the page leaves it to the "Send a code" button.
    if (hasApp || autoSent.current) return;
    autoSent.current = true;
    let justSignedIn = false;
    try {
      justSignedIn = sessionStorage.getItem(SEND_CODE_KEY) !== null;
      sessionStorage.removeItem(SEND_CODE_KEY);
    } catch {
      // Storage can be off, e.g. in private windows: the button still works.
    }
    if (justSignedIn) void sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasApp]);

  async function verify(formData: FormData) {
    const code = String(formData.get('code')).trim();
    setPending(true);
    setError(undefined);
    const body = { code, trustDevice: trust };
    const { error } =
      mode === 'app'
        ? await authClient.twoFactor.verifyTotp(body)
        : mode === 'email'
          ? await authClient.twoFactor.verifyOtp(body)
          : await authClient.twoFactor.verifyBackupCode(body);
    setPending(false);
    if (error?.code === 'BANNED_USER') return router.push('/banned');
    if (error) return fail(error);
    router.push('/profiles');
    router.refresh();
  }

  if (expired) {
    return (
      <div className='flex flex-col gap-4 text-center'>
        <p className='text-muted-foreground text-sm text-pretty'>This took too long, so you&rsquo;ll need to enter your password again.</p>
        <Button asChild>
          <Link href='/sign-in'>Sign in again</Link>
        </Button>
      </div>
    );
  }

  const prompts: Record<Mode, string> = {
    app: 'Enter the 6-digit code from your authenticator app.',
    email: 'Enter the 6-digit code we emailed you.',
    backup: 'Enter one of the backup codes you saved.',
  };

  // Laid out like the sign-in card: the code and Continue, then the other
  // ways under an "or", as outline buttons like the passkey one there.
  return (
    <div className='flex flex-col gap-4'>
      <form action={verify} className='flex flex-col items-center gap-4'>
        <Label htmlFor={`${id}-code`} className='text-center text-sm font-normal text-pretty'>
          {prompts[mode]}
        </Label>
        {/* A new field for each kind of code, so none carries over. No
            autofocus: password managers offer a code when the field gains
            focus, which one focused before they notice it never does. */}
        {mode === 'backup' ? (
          <Input key={mode} id={`${id}-code`} name='code' required autoComplete='off' maxLength={20} className='w-52 text-center tracking-widest' />
        ) : (
          <CodeInput key={mode} id={`${id}-code`} invalid={!!error} />
        )}
        {mode === 'email' && (
          <p className='text-muted-foreground text-center text-xs'>
            {sending ? 'Sending a code…' : sent ? 'It expires in 5 minutes.' : null}{' '}
            <button type='button' onClick={sendCode} disabled={sending} className='text-primary font-medium hover:underline disabled:opacity-50'>
              {sent ? 'Send a new one' : 'Send a code'}
            </button>
          </p>
        )}
        <label htmlFor={`${id}-trust`} className='text-muted-foreground flex cursor-pointer items-center gap-2 text-xs'>
          <Checkbox id={`${id}-trust`} checked={trust} onCheckedChange={(checked) => setTrust(checked === true)} />
          Don&rsquo;t ask again on this device for 30 days
        </label>
        {error && <p className='text-destructive text-center text-sm'>{error}</p>}
        <Button type='submit' disabled={pending} className='w-full'>
          {pending && <Loader2Icon className='animate-spin' />}
          Continue
        </Button>
      </form>

      <div className='text-muted-foreground flex items-center gap-3 text-xs'>
        <span className='bg-border h-px flex-1' />
        or
        <span className='bg-border h-px flex-1' />
      </div>

      <div className='flex flex-col gap-2'>
        {mode !== 'app' && hasApp && (
          <Button variant='outline' size='lg' onClick={() => switchTo('app')}>
            <SmartphoneIcon />
            Use your authenticator app
          </Button>
        )}
        {mode !== 'email' && (
          <Button
            variant='outline'
            size='lg'
            onClick={() => {
              switchTo('email');
              if (!sent) void sendCode();
            }}
          >
            <MailIcon />
            Email me a code instead
          </Button>
        )}
        {mode !== 'backup' && hasApp && (
          <Button variant='outline' size='lg' onClick={() => switchTo('backup')}>
            <KeyRoundIcon />
            Use a backup code
          </Button>
        )}
      </div>
    </div>
  );

  function switchTo(to: Mode) {
    setMode(to);
    setError(undefined);
  }
}
