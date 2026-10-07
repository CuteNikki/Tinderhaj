import type { Metadata } from 'next';

import { accountMetadata } from '@/constants/metadata';
import { getAccountSettings } from '@/lib/account';
import { enabledProviders } from '@/lib/auth';
import { requireUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { DeleteAccount } from '@/components/account/delete-account';
import { EmailSettings } from '@/components/account/email-settings';
import { LinkedAccounts } from '@/components/account/linked-accounts';
import { PasskeySettings } from '@/components/account/passkey-settings';
import { PasswordForm } from '@/components/account/password-form';
import { SessionList } from '@/components/account/session-list';
import { TwoFactorSettings } from '@/components/account/two-factor-settings';
import { UsernameForm } from '@/components/account/username-form';
import { Stagger } from '@/components/common/stagger';
import { ScrollReveal } from '@/components/home/scroll-reveal';

export const metadata: Metadata = accountMetadata;

export default async function AccountPage({ searchParams }: PageProps<'/dashboard/account'>) {
  const { user, session } = await requireUser();
  const { error } = await searchParams;
  const { accounts, hasPassword, twoFactor, trustedDevices, passkeys, sessions } = await getAccountSettings({ userId: user.id, sessionId: session.id });

  return (
    <div className='bg-background flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger className='mb-8'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Your account</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Settings</h1>
        </Stagger>
        <div className='grid items-start gap-6 lg:grid-cols-2'>
          <div className='grid gap-6'>
            <Section title='Username' description='Choose the name people will see across Tinderhaj.' delay={CONTENT_DELAY}>
              <UsernameForm username={user.name} />
            </Section>
            <Section title='Email' description='Where we send sign-in codes and links to reset your password.' delay={CONTENT_DELAY + STAGGER}>
              <EmailSettings email={user.email} verified={user.emailVerified} />
            </Section>
            <Section
              title='Password'
              description={hasPassword ? undefined : 'You sign in with another account. Add a password to also sign in with your email.'}
              delay={CONTENT_DELAY + 2 * STAGGER}
            >
              <PasswordForm hasPassword={hasPassword} />
            </Section>
          </div>
          <div className='grid gap-6'>
            <Section title='Sign-in methods' description='Connect other accounts to sign in with them too.' delay={CONTENT_DELAY + STAGGER}>
              <LinkedAccounts providers={enabledProviders} accounts={accounts} error={typeof error === 'string' ? error : undefined} />
            </Section>
            <Section title='Two-step sign-in' delay={CONTENT_DELAY + 2 * STAGGER}>
              <TwoFactorSettings method={twoFactor} hasPassword={hasPassword} trustedDevices={trustedDevices} />
            </Section>
            <Section
              title='Passkeys'
              description='Sign in with your fingerprint, face or device PIN instead of a password. Passkeys only work on the device that made them, or the ones it syncs with.'
              delay={CONTENT_DELAY + 3 * STAGGER}
            >
              <PasskeySettings passkeys={passkeys} />
            </Section>
          </div>
          <Section title='Sessions' description='Everywhere you are signed in right now.' className='lg:col-span-2' delay={CONTENT_DELAY + 4 * STAGGER}>
            <SessionList sessions={sessions} />
          </Section>
          <Section
            title='Delete account'
            description='This permanently deletes your account, profiles, and sessions. We’ll email you a link to confirm first.'
            destructive
            className='lg:col-span-2'
            delay={CONTENT_DELAY + 5 * STAGGER}
          >
            <DeleteAccount hasPassword={hasPassword} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  destructive,
  className,
  delay,
  children,
}: {
  title: string;
  description?: string;
  destructive?: boolean;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <ScrollReveal delay={delay} className={className}>
      <section className={cn('rounded-xl border p-4', destructive ? 'border-destructive/30 bg-destructive/5' : 'border-foreground/10 bg-card shadow-sm')}>
        <div className='mb-4'>
          <h2 className={cn('text-xl font-bold', destructive && 'text-destructive')}>{title}</h2>
          {description && <p className='text-muted-foreground mt-1 text-sm text-pretty'>{description}</p>}
        </div>
        {children}
      </section>
    </ScrollReveal>
  );
}
