import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { verifyMetadata } from '@/constants/metadata';
import { profileFieldLabel } from '@/lib/profile-fields';
import { QUERIES } from '@/lib/queries';
import { isModerator, requireUser } from '@/lib/session';
import { CONTENT_DELAY } from '@/lib/motion';

import { BackLink, Eyebrow, PageTitle } from '@/components/common/heading';
import { LocalTime } from '@/components/common/local-time';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { UnverifyButton } from '@/components/verify/unverify-button';
import { VerifyProfileCard } from '@/components/verify/verify-profile-card';

// Not the shark's name: metadata is worked out apart from the page's moderator check.
export const metadata: Metadata = verifyMetadata;

/**
 * One shark's review, where the bot's message in the Discord review channel
 * links. Waiting, it can be verified or rejected here; otherwise it shows how
 * the review went.
 */
export default async function ReviewPage({ params }: PageProps<'/moderation/verification/[id]'>) {
  const session = await requireUser();

  if (!isModerator(session.user.role)) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center px-4 py-28 text-center'>
        <h1 className='text-3xl font-black tracking-tight'>Nothing to see here.</h1>
        <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed'>You need moderator access to review profiles.</p>
      </div>
    );
  }

  const { id } = await params;
  const profile = await QUERIES.getProfileForReview(id);
  if (!profile) notFound();

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <BackLink href='/moderation/verification'>Verification</BackLink>
          <Eyebrow>Review</Eyebrow>
          <PageTitle className='break-all'>{profile.displayName}</PageTitle>
          <p className='text-muted-foreground mt-1 break-all'>
            From{' '}
            <Link href={`/moderation/users/${profile.user.id}`} className='text-foreground font-semibold hover:underline'>
              @{profile.user.username}
            </Link>
            {profile.status === 'PENDING' && profile.submittedAt && (
              <>
                , sent <LocalTime iso={profile.submittedAt.toISOString()} />
              </>
            )}
          </p>
        </Stagger>

        <ScrollReveal delay={CONTENT_DELAY} className='max-w-md'>
          {profile.status === 'PENDING' ? (
            <VerifyProfileCard profile={profile} fullBio />
          ) : (
            <div className='flex flex-col gap-4'>
              <p className='text-muted-foreground text-sm text-pretty'>
                {profile.status === 'VERIFIED' && (
                  <>
                    Already verified
                    {profile.verifiedAt && (
                      <>
                        {' '}
                        <LocalTime iso={profile.verifiedAt.toISOString()} />
                      </>
                    )}
                    . Verified by mistake? Unverify it to send it back to review.
                  </>
                )}
                {profile.status === 'REJECTED' && "Rejected. It comes back here once they've fixed it and sent it again."}
                {profile.status === 'CREATED' && "Taken back to edit. It comes back here once it's sent again."}
              </p>
              {profile.status === 'REJECTED' && (profile.rejectedFields.length > 0 || profile.rejectionNote) && (
                <div className='border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-3 text-sm'>
                  {profile.rejectedFields.length > 0 && (
                    <p>
                      <span className='font-semibold'>Needs fixing:</span> {profile.rejectedFields.map(profileFieldLabel).join(', ')}
                    </p>
                  )}
                  {profile.rejectionNote && (
                    <p className='mt-1 leading-relaxed'>
                      <span className='font-semibold'>Note:</span> {profile.rejectionNote}
                    </p>
                  )}
                </div>
              )}
              <DiscoveryProfile
                profile={profile}
                heading='h2'
                showStatus
                action={
                  profile.status === 'VERIFIED' ? (
                    <UnverifyButton profile={{ id: profile.id, displayName: profile.displayName }} verifiedAt={profile.verifiedAt?.toISOString()} />
                  ) : undefined
                }
              />
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
