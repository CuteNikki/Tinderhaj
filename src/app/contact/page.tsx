import { ArrowUpRightIcon, BugIcon, MailIcon, ShieldIcon, UserRoundCheckIcon, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';

import { contactMetadata } from '@/constants/metadata';
import { CONTACT_EMAIL, GITHUB_URL } from '@/constants/contact';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { Eyebrow, PageNote, PageTitle } from '@/components/common/heading';
import { sunlit } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { CopyEmail } from '@/components/contact/copy-email';
import { SocialLinks } from '@/components/contact/social-links';
import { ScrollReveal } from '@/components/home/scroll-reveal';
import { Questions } from '@/components/sections/questions';
import { ReadyWhenYouAre } from '@/components/sections/ready-when-you-are';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = contactMetadata;

const ANSWERS: { title: string; copy: string; link: string; href: string; icon: LucideIcon }[] = [
  {
    title: 'Profile waiting for review?',
    copy: 'Moderators check every new profile by hand. Your profiles page shows how far along yours is.',
    link: 'Your profiles',
    href: '/dashboard/profiles',
    icon: UserRoundCheckIcon,
  },
  { title: 'Found a bug?', copy: 'The code lives on GitHub, and so do bug reports.', link: 'Report it', href: `${GITHUB_URL}/issues`, icon: BugIcon },
  { title: 'About your data?', copy: 'What we keep, why, and how to have it deleted.', link: 'Privacy Policy', href: '/privacy', icon: ShieldIcon },
];

export default function ContactPage() {
  return (
    <>
      <div data-water='band' data-tone='muted' className='flex flex-1 flex-col px-4 pt-28 pb-18 sm:px-5 lg:px-8'>
        <div className='container mx-auto max-w-7xl'>
          <Stagger id='page-header' variant='sink' className='mb-24'>
            <Eyebrow>Contact</Eyebrow>
            <PageTitle>Get in touch</PageTitle>
            <PageNote>Questions, feedback, or something not working? Here&apos;s how to reach us.</PageNote>
          </Stagger>

          {/* Ways to reach us, and beside them on wide screens, answers that might save writing at all */}
          <div className='grid gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20'>
            <div>
              <ScrollReveal delay={CONTENT_DELAY}>
                <Eyebrow as='h2' className='mb-4'>
                  Reach us
                </Eyebrow>
              </ScrollReveal>
              <ScrollReveal delay={CONTENT_DELAY} variant='card'>
                <section
                  aria-labelledby='email'
                  className='border-foreground/10 bg-card dark:bg-accent flex flex-col gap-5 rounded-2xl border p-5 shadow-sm sm:flex-row sm:items-center sm:p-6'
                >
                  <span className='bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full'>
                    <MailIcon className='size-6' aria-hidden='true' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <h2 id='email' className='text-muted-foreground text-sm'>
                      Email us, about anything at all
                    </h2>
                    <a href={`mailto:${CONTACT_EMAIL}`} className='hover:text-primary text-lg font-bold break-all transition-colors'>
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <Button size='lg' className={sunlit} asChild>
                      <a href={`mailto:${CONTACT_EMAIL}`}>
                        Write
                        <ArrowUpRightIcon />
                      </a>
                    </Button>
                    <CopyEmail />
                  </div>
                </section>
              </ScrollReveal>

              <SocialLinks delay={CONTENT_DELAY + STAGGER} className='mt-3' />
            </div>

            <div>
              <ScrollReveal delay={CONTENT_DELAY}>
                <Eyebrow as='h2' className='mb-4'>
                  Good to know
                </Eyebrow>
              </ScrollReveal>
              <Stagger
                as='ul'
                itemAs='li'
                gap={STAGGER}
                delay={CONTENT_DELAY + STAGGER}
                className='divide-border divide-y'
                itemClassName='flex gap-4 py-4 first:pt-0 last:pb-0'
              >
                {ANSWERS.map(({ title, copy, link, href, icon: Icon }) => (
                  <Fragment key={title}>
                    <Icon className='text-muted-foreground mt-0.5 size-5 shrink-0' aria-hidden='true' />
                    <div className='flex min-w-0 flex-1 flex-col items-start gap-1'>
                      <div>
                        <h3 className='font-bold'>{title}</h3>
                        <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>{copy}</p>
                      </div>
                      {href.startsWith('http') ? (
                        <a
                          href={href}
                          target='_blank'
                          rel='noreferrer'
                          className='text-primary inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline'
                        >
                          {link}
                          <ArrowUpRightIcon className='size-3.5' aria-hidden='true' />
                        </a>
                      ) : (
                        <Link href={href} className='text-primary shrink-0 text-sm font-semibold hover:underline'>
                          {link}
                        </Link>
                      )}
                    </div>
                  </Fragment>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
      <Questions tone='background' />
      <ReadyWhenYouAre />
    </>
  );
}
