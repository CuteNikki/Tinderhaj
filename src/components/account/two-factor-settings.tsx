'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

import { CheckIcon, CopyIcon, DownloadIcon, Loader2Icon, MailIcon, ShieldCheckIcon, SmartphoneIcon } from 'lucide-react';

import type { TwoFactorMethod } from '@/lib/account';
import { forgetTrustedDevices } from '@/lib/actions';
import { authClient } from '@/lib/auth-client';

import { useConfirm } from '@/components/common/confirm-dialog';
import { CodeInput } from '@/components/common/code-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * What the section shows: the current state, asking for the password before
 * a change, setting up an authenticator app, or new backup codes to save.
 */
type Step =
  | { kind: 'idle' }
  | { kind: 'password'; action: 'app' | 'email' | 'off' | 'codes' }
  | { kind: 'app'; totpURI: string; backupCodes: string[] }
  | { kind: 'codes'; backupCodes: string[] };

const methodLabels = {
  app: 'Authenticator app',
  email: 'Email codes',
} as const;

/**
 * Two-step sign-in: after the password, a code from an authenticator app or
 * by email. Passkeys skip it.
 */
export function TwoFactorSettings({
  method,
  hasPassword,
  trustedDevices,
}: {
  method: TwoFactorMethod;
  hasPassword: boolean;
  /** Devices where "Don't ask again" was ticked, and still counts. */
  trustedDevices: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ kind: 'idle' });
  const [forgetting, startForgetting] = useTransition();
  const [ask, confirmDialog] = useConfirm();

  function done(message: string) {
    toast.success(message, { duration: 5000, position: 'top-center' });
    setStep({ kind: 'idle' });
    router.refresh();
  }

  if (!hasPassword) {
    return (
      <p className='text-muted-foreground text-sm text-pretty'>
        Two-step sign-in asks for a code after your password. You sign in with another account, which has its own protection, so there&rsquo;s nothing to
        protect here yet. Add a password first if you&rsquo;d like to use it.
      </p>
    );
  }

  if (step.kind === 'password') {
    const labels = {
      app: 'Set up an authenticator app',
      email: 'Turn on email codes',
      off: 'Turn off two-step sign-in',
      codes: 'Make new backup codes',
    };
    return (
      <PasswordStep
        submit={labels[step.action]}
        destructive={step.action === 'off'}
        onCancel={() => setStep({ kind: 'idle' })}
        onSubmit={async (password) => {
          switch (step.action) {
            case 'app': {
              const { data, error } = await authClient.twoFactor.enable({
                password,
                method: 'totp',
              });
              if (error) return error.message ?? 'Something went wrong';
              if (!data || !('totpURI' in data) || !data.totpURI) {
                return 'Something went wrong';
              }
              setStep({
                kind: 'app',
                totpURI: data.totpURI,
                backupCodes: data.backupCodes ?? [],
              });
              return;
            }
            case 'email': {
              const { error } = await authClient.twoFactor.enable({
                password,
                method: 'otp',
              });
              if (error) return error.message ?? 'Something went wrong';
              return done('Two-step sign-in is on');
            }
            case 'off': {
              const { error } = await authClient.twoFactor.disable({
                password,
              });
              if (error) return error.message ?? 'Something went wrong';
              return done('Two-step sign-in is off');
            }
            case 'codes': {
              const { data, error } = await authClient.twoFactor.generateBackupCodes({ password });
              if (error) return error.message ?? 'Something went wrong';
              setStep({ kind: 'codes', backupCodes: data?.backupCodes ?? [] });
              return;
            }
          }
        }}
      />
    );
  }

  if (step.kind === 'app') {
    return (
      <AppSetup
        totpURI={step.totpURI}
        backupCodes={step.backupCodes}
        onCancel={() => setStep({ kind: 'idle' })}
        onDone={() => done('Two-step sign-in is on')}
      />
    );
  }

  if (step.kind === 'codes') {
    return (
      <div className='border-foreground/10 flex flex-col gap-4 rounded-xl border p-4'>
        <BackupCodes codes={step.backupCodes} />
        <p className='text-muted-foreground text-sm'>Your old backup codes don&rsquo;t work anymore.</p>
        <Button className='w-fit' onClick={() => done('Backup codes saved')}>
          Done
        </Button>
      </div>
    );
  }

  if (!method) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-muted-foreground text-sm text-pretty'>
          Asks for a code after your password, so your password alone isn&rsquo;t enough to sign in. Choose where the code comes from:
        </p>
        <div className='grid gap-3 sm:grid-cols-2'>
          <MethodChoice
            icon={SmartphoneIcon}
            title={methodLabels.app}
            text='A code from an app like Google Authenticator, 1Password or Bitwarden. The safest choice.'
            onClick={() => setStep({ kind: 'password', action: 'app' })}
          />
          <MethodChoice
            icon={MailIcon}
            title={methodLabels.email}
            text='We email you a code each time you sign in with your password.'
            onClick={() => setStep({ kind: 'password', action: 'email' })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='border-foreground/10 flex flex-col gap-3 rounded-xl border p-3 px-4 sm:flex-row sm:items-center'>
        <div className='flex flex-1 items-center gap-3'>
          <span className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'>
            <ShieldCheckIcon className='size-5' aria-hidden />
          </span>
          <div>
            <p className='font-medium'>On, with {methodLabels[method]}</p>
            <p className='text-muted-foreground text-sm'>
              {method === 'app' ? 'You can also get a code by email, or use a backup code.' : 'A code comes to your email address each time.'}
            </p>
          </div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {method === 'app' && (
            <Button variant='outline' size='sm' onClick={() => setStep({ kind: 'password', action: 'codes' })}>
              New backup codes
            </Button>
          )}
          <Button variant='destructive' size='sm' onClick={() => setStep({ kind: 'password', action: 'off' })}>
            Turn off
          </Button>
        </div>
      </div>
      {trustedDevices > 0 && (
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-muted-foreground text-sm text-pretty'>
            {trustedDevices === 1 ? '1 device' : `${trustedDevices} devices`} won&rsquo;t ask for a code, because you ticked &ldquo;Don&rsquo;t ask again&rdquo;
            there.
          </p>
          <Button
            variant='destructive'
            size='sm'
            className='w-fit shrink-0'
            disabled={forgetting}
            onClick={async () => {
              const confirmed = await ask({
                title: 'Forget trusted devices?',
                description: 'Every device asks for a code again the next time you sign in on it.',
                action: 'Forget',
                destructive: true,
              });
              if (!confirmed) return;
              startForgetting(async () => {
                const error = await forgetTrustedDevices();
                if (error) toast.error(error.message, { duration: 5000, position: 'top-center' });
                else toast.success('Every device asks for a code again.', { duration: 5000, position: 'top-center' });
              });
            }}
          >
            {forgetting && <Loader2Icon className='animate-spin' />}
            Forget trusted devices
          </Button>
        </div>
      )}
      {confirmDialog}
    </div>
  );
}

function MethodChoice({ icon: Icon, title, text, onClick }: { icon: typeof MailIcon; title: string; text: string; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='ring-foreground/10 hover:bg-muted/50 focus-visible:ring-ring flex flex-col gap-2 rounded-xl p-4 text-left ring-1 transition-colors outline-none focus-visible:ring-2'
    >
      <span className='flex items-center gap-3'>
        <span className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full'>
          <Icon className='size-5' aria-hidden />
        </span>
        <span className='font-medium'>{title}</span>
      </span>
      <span className='text-muted-foreground text-sm text-pretty'>{text}</span>
    </button>
  );
}

/**
 * Asks for the password before a change. `onSubmit` returns an error to
 * show, or nothing once it worked.
 */
function PasswordStep({
  submit,
  destructive,
  onSubmit,
  onCancel,
}: {
  submit: string;
  destructive?: boolean;
  onSubmit: (password: string) => Promise<string | void>;
  onCancel: () => void;
}) {
  const id = useId();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(undefined);
        const password = String(new FormData(event.currentTarget).get('password'));
        const failed = await onSubmit(password).catch(() => 'Something went wrong, try again');
        setPending(false);
        if (failed) setError(failed);
      }}
      className='border-foreground/10 flex flex-col gap-3 rounded-xl border p-4'
    >
      <div className='flex flex-col gap-1'>
        <Label htmlFor={id}>Your password</Label>
        {/* A neutral id: password managers take ones that mention two-factor
            for one-time code fields, and don't offer the password there. */}
        <Input id={id} name='password' type='password' required autoComplete='current-password' />
      </div>
      {error && <p className='text-destructive text-sm'>{error}</p>}
      <div className='flex flex-wrap gap-2'>
        <Button type='submit' variant={destructive ? 'destructive' : 'default'} disabled={pending}>
          {pending && <Loader2Icon className='animate-spin' />}
          {submit}
        </Button>
        <Button type='button' variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/**
 * Setting up an authenticator app: scan the code, then enter the first code
 * the app shows to confirm, then save the backup codes.
 */
function AppSetup({ totpURI, backupCodes, onCancel, onDone }: { totpURI: string; backupCodes: string[]; onCancel: () => void; onDone: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  // For typing in by hand, when scanning isn't possible.
  const secret = new URL(totpURI).searchParams.get('secret') ?? '';

  if (confirmed) {
    return (
      <div className='border-foreground/10 flex flex-col gap-4 rounded-xl border p-4'>
        <p className='flex items-center gap-2 font-medium'>
          <CheckIcon className='text-primary size-4' aria-hidden />
          Your authenticator app is set up
        </p>
        <BackupCodes codes={backupCodes} />
        <Button className='w-fit' onClick={onDone}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className='border-foreground/10 flex flex-col gap-4 rounded-xl border p-4'>
      <ol className='flex list-decimal flex-col gap-1 pl-5 text-sm'>
        <li>Open your authenticator app and add a new account.</li>
        <li>Scan this code, or type in the key under it.</li>
        <li>Enter the 6-digit code the app shows.</li>
      </ol>
      <div className='flex flex-col items-start gap-2'>
        {/* Dark on light in both themes, so every app can scan it. */}
        <div className='rounded-xl bg-white p-3'>
          <QRCode value={totpURI} size={160} title='Code for your authenticator app' />
        </div>
        <code className='bg-muted rounded-md px-2 py-1 text-xs break-all select-all'>{secret}</code>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setPending(true);
          setError(undefined);
          const code = String(new FormData(event.currentTarget).get('code'));
          const { error } = await authClient.twoFactor.verifyTotp({ code });
          setPending(false);
          if (error) {
            return setError('That code didn’t work. Check the time on your phone, then try the newest code.');
          }
          setConfirmed(true);
        }}
        className='flex flex-col gap-3'
      >
        <div className='flex flex-col gap-1'>
          <Label htmlFor='totp-code'>Code from the app</Label>
          <CodeInput id='totp-code' invalid={!!error} />
        </div>
        {error && <p className='text-destructive text-sm'>{error}</p>}
        <div className='flex flex-wrap gap-2'>
          <Button type='submit' disabled={pending}>
            {pending && <Loader2Icon className='animate-spin' />}
            Confirm
          </Button>
          <Button type='button' variant='secondary' onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

/** Backup codes to save, with ways to copy or download them. */
function BackupCodes({ codes }: { codes: string[] }) {
  const text = codes.join('\n');
  return (
    <div className='flex flex-col gap-3'>
      <div>
        <p className='font-medium'>Save your backup codes</p>
        <p className='text-muted-foreground text-sm text-pretty'>
          If you lose your phone, each of these works once instead of a code. Keep them somewhere safe, like a password manager. They won&rsquo;t be shown
          again.
        </p>
      </div>
      <ul className='bg-muted/60 grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg p-3 font-mono text-sm sm:grid-cols-3'>
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <div className='flex flex-wrap gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            toast.success('Backup codes copied.', { duration: 5000, position: 'top-center' });
          }}
        >
          <CopyIcon />
          Copy
        </Button>
        <Button variant='outline' size='sm' asChild>
          <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Tinderhaj backup codes\n\n${text}\n`)}`} download='tinderhaj-backup-codes.txt'>
            <DownloadIcon />
            Download
          </a>
        </Button>
      </div>
    </div>
  );
}
