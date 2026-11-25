import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';

import { HeartIcon } from 'lucide-react';

import { matchPageMetadata } from '@/constants/metadata';

import { getSharedMatch } from '@/lib/hearts';
import { CONTENT_DELAY } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryProfile } from '@/components/discovery/profile';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { AddYourShark } from '@/components/sections/add-your-shark';

// The stripe down the side of the card a link to it unfurls into: the water of its image.
export const viewport: Viewport = { themeColor: '#1d78d6' };

export async function generateMetadata({
  params,
}: PageProps<'/match/[id]'>): Promise<Metadata> {
  // Whether it's still a match is as of now.
  await connection();
  const { id } = await params;
  const match = await getSharedMatch(id);
  if (!match) return matchPageMetadata;

  const [one, other] = match.sharks;
  return {
    title: `${one.displayName} & ${other.displayName}`,
    description: `${one.displayName} (@${one.user.username}) and ${other.displayName} (@${other.user.username}) hearted each other on Tinderhaj. It's a match!`,
  };
}

/** A match one of its owners shared: both sharks, side by side. */
export default async function MatchPage({ params }: PageProps<'/match/[id]'>) {
  // Whether it's still a match is as of now.
  await connection();
  const { id } = await params;
  const match = await getSharedMatch(id);
  if (!match) notFound();

  const [one, other] = match.sharks;

  return (
    <>
      <div
        data-water='band'
        className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'
      >
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>It&apos;s a match</Eyebrow>
            <PageTitle className='wrap-break-word'>
              {one.displayName} & {other.displayName}
            </PageTitle>
            <PageNote>
              Hearted each other on{' '}
              {match.at.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </PageNote>
          </Stagger>

          {/* Side by side on wide screens, a heart between them; one above the other on phones */}
          <div className='grid max-w-4xl grid-cols-1 items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
            <ScrollReveal delay={CONTENT_DELAY} variant='card'>
              <DiscoveryProfile profile={one} heading='h2' eager />
            </ScrollReveal>
            <ScrollReveal
              delay={CONTENT_DELAY + 0.1}
              className='flex justify-center'
            >
              <span className='flex size-14 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-foreground/10'>
                <HeartIcon
                  className='size-7 fill-current text-primary'
                  aria-hidden='true'
                />
              </span>
            </ScrollReveal>
            <ScrollReveal delay={CONTENT_DELAY + 0.2} variant='card'>
              <DiscoveryProfile profile={other} heading='h2' eager />
            </ScrollReveal>
          </div>
        </div>
      </div>
      <AddYourShark tone='background' />
    </>
  );
}
