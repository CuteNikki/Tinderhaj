import { ArrowUpRightIcon, BugIcon, MailIcon, ShieldIcon, UserRoundCheckIcon, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { contactMetadata } from '@/constants/metadata';
import { CONTACT_EMAIL, GITHUB_URL, SOCIALS } from '@/constants/contact';
import { CONTENT_DELAY, STAGGER } from '@/lib/motion';

import { sunlit } from '@/components/common/ocean';
import { Stagger } from '@/components/common/stagger';
import { CopyEmail } from '@/components/contact/copy-email';
import { SocialIcon } from '@/components/contact/social-icon';
import { ScrollReveal } from '@/components/home/scroll-reveal';
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
  const socials = SOCIALS.filter((social) => social.href);

  return (
    <div data-water='band' className='flex flex-1 flex-col px-4 py-28 sm:px-5 lg:px-8'>
      <div className='container mx-auto max-w-7xl'>
        <Stagger id='page-header' variant='sink' className='mb-24'>
          <p className='text-primary mb-1 text-xs font-bold tracking-widest uppercase'>Contact</p>
          <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Get in touch</h1>
          <p className='text-muted-foreground mt-2 text-sm text-pretty'>Questions, feedback, or something not working? Here&apos;s how to reach us.</p>
        </Stagger>

        {/* Ways to reach us, and beside them on wide screens, answers that might save writing at all */}
        <div className='grid gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20'>
          <div>
            <h2 className='text-primary mb-4 text-xs font-bold tracking-widest uppercase'>Reach us</h2>
            <ScrollReveal delay={CONTENT_DELAY} variant='card'>
              <section
                aria-labelledby='email'
                className='border-foreground/10 bg-card flex flex-col gap-5 rounded-3xl border p-5 shadow-sm sm:flex-row sm:items-center sm:p-6'
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
                  <Button className={`${sunlit} h-10 rounded-full px-5`} asChild>
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      Write
                      <ArrowUpRightIcon />
                    </a>
                  </Button>
                  <CopyEmail />
                </div>
              </section>
            </ScrollReveal>

            {socials.length > 0 && (
              <Stagger
                as='ul'
                itemAs='li'
                variant='card'
                gap={STAGGER}
                delay={CONTENT_DELAY + STAGGER}
                className='mt-3 grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-3'
                itemClassName='h-full'
              >
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href!}
                    target='_blank'
                    rel='noreferrer'
                    title={social.handle ?? undefined}
                    className='group/social border-foreground/10 bg-card ease-bounce flex h-full items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
                  >
                    <span className='bg-foreground/5 flex size-10 shrink-0 items-center justify-center rounded-full'>
                      <SocialIcon id={social.id} className='group-hover/social:animate-wiggle size-5' />
                    </span>
                    <span className='min-w-0 flex-1'>
                      <span className='block font-bold'>{social.name}</span>
                      <span className='text-muted-foreground block text-sm'>{social.blurb}</span>
                    </span>
                    <ArrowUpRightIcon
                      className='text-muted-foreground ease-bounce size-4 shrink-0 transition-transform duration-300 group-hover/social:translate-x-0.5 group-hover/social:-translate-y-0.5'
                      aria-hidden='true'
                    />
                  </a>
                ))}
              </Stagger>
            )}
          </div>

          <ScrollReveal delay={CONTENT_DELAY + 3 * STAGGER}>
            <h2 className='text-primary mb-4 text-xs font-bold tracking-widest uppercase'>Good to know</h2>
            <ul className='divide-border divide-y'>
              {ANSWERS.map(({ title, copy, link, href, icon: Icon }) => (
                <li key={title} className='flex gap-4 py-4 first:pt-0 last:pb-0'>
                  <Icon className='text-primary mt-0.5 size-5 shrink-0' aria-hidden='true' />
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
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
