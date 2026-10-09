import { ArrowLeftIcon, BadgeCheckIcon, BanIcon, FingerprintIcon, ShieldCheckIcon, UserRoundIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { userMetadata } from '@/constants/metadata';
import { isBanned } from '@/lib/bans';
import { providerLabel } from '@/lib/providers';
import { QUERIES } from '@/lib/queries';
import { canBan, canManageAccount, isAdmin, ROLE_DESCRIPTIONS, ROLE_LABELS } from '@/lib/roles';
import { isModerator, requireUser } from '@/lib/session';

import { SettingsSection } from '@/components/common/settings-section';
import { Eyebrow, PageTitle } from '@/components/common/heading';
import { EmptyState } from '@/components/common/empty-state';
import { Stagger } from '@/components/common/stagger';
import { LocalTime } from '@/components/common/local-time';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { Badge } from '@/components/ui/badge';
import { AccountActions } from '@/components/users/account-actions';
import { BanForm, UnbanButton } from '@/components/users/ban-controls';
import { UnverifyButton } from '@/components/verify/unverify-button';
import { RoleSelect } from '@/components/users/role-select';

// Not the username: metadata is worked out apart from the page's moderator check.
export const metadata: Metadata = userMetadata;

/** One account, for moderators and admins: their profiles, role, ban and account actions. */
export default async function UserPage({ params }: PageProps<'/moderation/users/[id]'>) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to see users.</p>
      </div>
    );
  }

  const { id } = await params;
  const admin = isAdmin(session.user.role);
  const user = await QUERIES.getUserDetail(id, admin);
  if (!user) notFound();

  const self = user.id === session.user.id;
  const banned = isBanned(user);
  const mayBan = !self && canBan(session.user.role, user.role);
  const mayManage = !self && canManageAccount(session.user.role, user.role);
  const providers = user.accounts.map((account) => account.providerId).filter((id) => id !== 'credential');

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <Link href='/moderation/users' className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors'>
            <ArrowLeftIcon className='size-4' aria-hidden='true' />
            Users
          </Link>
          <Eyebrow>Moderation</Eyebrow>
          <PageTitle className='break-all'>@{user.username}</PageTitle>
          {'email' in user && user.email && <p className='text-muted-foreground mt-1 break-all'>{user.email}</p>}
          <Stagger className='mt-3 flex flex-wrap items-center gap-1.5' itemAs='span' gap={0.03} delay={0.45}>
            <Badge variant={user.role === 'USER' ? 'outline' : 'default'}>{ROLE_LABELS[user.role]}</Badge>
            {self && <Badge variant='secondary'>You</Badge>}
            {banned && (
              <Badge variant='destructive'>
                <BanIcon aria-hidden='true' />
                Banned
              </Badge>
            )}
            <Badge variant='outline'>
              {user.emailVerified && <BadgeCheckIcon aria-hidden='true' />}
              {user.emailVerified ? 'Email verified' : 'Email unverified'}
            </Badge>
            {user.twoFactorEnabled && (
              <Badge variant='outline'>
                <ShieldCheckIcon aria-hidden='true' />
                Two-step sign-in
              </Badge>
            )}
            {user._count.passkeys > 0 && (
              <Badge variant='outline'>
                <FingerprintIcon aria-hidden='true' />
                {user._count.passkeys === 1 ? '1 passkey' : `${user._count.passkeys} passkeys`}
              </Badge>
            )}
            {providers.map((provider) => (
              <Badge key={provider} variant='outline'>
                {providerLabel(provider)}
              </Badge>
            ))}
            <span className='text-muted-foreground ml-1 text-xs'>
              Joined {user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </Stagger>
        </Stagger>

        <div className='grid gap-6'>
          <SettingsSection
            title='Profiles'
            description={user.profiles.length === 1 ? '1 profile, in any state of review.' : `${user.profiles.length} profiles, in any state of review.`}
            delay={0.6}
          >
            {user.profiles.length ? (
              <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {user.profiles.map((profile) => (
                  <DiscoveryProfile
                    key={profile.id}
                    profile={profile}
                    showStatus
                    action={
                      profile.status === 'VERIFIED' ? (
                        <UnverifyButton profile={{ id: profile.id, displayName: profile.displayName }} verifiedAt={profile.verifiedAt?.toISOString()} />
                      ) : undefined
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState icon={UserRoundIcon} title='No profiles.' description='They haven’t made a profile yet.' />
            )}
          </SettingsSection>

          <SettingsSection title='Role' description={ROLE_DESCRIPTIONS[user.role]} delay={0.7}>
            {admin && !self ? (
              <RoleSelect userId={user.id} username={user.username} role={user.role} />
            ) : (
              <p className='text-muted-foreground text-sm'>
                {self ? 'You can’t change your own role.' : 'Only admins can change roles.'} {ROLE_LABELS[user.role]} is the current role.
              </p>
            )}
          </SettingsSection>

          {(banned || mayBan) && (
            <SettingsSection
              title='Ban'
              description={banned ? undefined : 'Signs them out everywhere and stops them signing in. They see the reason, if you give one, when they try.'}
              destructive
              delay={0.8}
            >
              {banned ? (
                <div className='flex flex-col gap-3'>
                  <p className='text-sm'>
                    Banned
                    {user.bannedBy && (
                      <>
                        {' '}
                        by{' '}
                        <Link href={`/moderation/users/${user.bannedBy.id}`} className='font-semibold hover:underline'>
                          @{user.bannedBy.username}
                        </Link>
                      </>
                    )}
                    {user.bannedAt && (
                      <>
                        {' '}
                        <LocalTime iso={user.bannedAt.toISOString()} />
                      </>
                    )}
                    {user.banExpires ? (
                      <>
                        , until <LocalTime iso={user.banExpires.toISOString()} absolute />.
                      </>
                    ) : (
                      ', until the ban is lifted.'
                    )}
                  </p>
                  <p className='bg-background rounded-lg px-3 py-2 text-sm wrap-break-word whitespace-pre-line'>
                    {user.banReason ?? <span className='text-muted-foreground'>No reason given.</span>}
                  </p>
                  {mayBan ? <UnbanButton user={user} /> : <p className='text-muted-foreground text-sm'>Only admins can lift a moderator’s ban.</p>}
                </div>
              ) : (
                <BanForm user={user} />
              )}
            </SettingsSection>
          )}

          {mayManage && (
            <SettingsSection title='Account' description='Things only admins can do. Each asks first.' delay={0.9}>
              <AccountActions user={user} sessions={user._count.sessions} />
            </SettingsSection>
          )}
        </div>
      </div>
    </div>
  );
}
