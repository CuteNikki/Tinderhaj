import Link from 'next/link';
import { Suspense } from 'react';

import { Code2, Mail } from 'lucide-react';

import { getSession } from '@/lib/session';
import { socialLink } from '@/lib/social-link';

import { Logo } from '@/components/common/logo';
import { Stagger } from '@/components/common/stagger';
import { DiscoveryLink } from '@/components/discovery/link';

const productLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/guide' },
  { label: 'Discovery', href: '/discovery#top' },
];

const communityLinks = [
  { label: 'About', href: '/about' },
  { label: 'Community', href: '/community' },
  { label: 'Guidelines', href: '/guidelines' },
  { label: 'Contact', href: '/contact' },
];

const signedOutLinks = [
  { label: 'Create a profile', href: '/sign-up' },
  { label: 'Sign in', href: '/sign-in' },
];

/** Named as in the menu, and two, like signed out, so the column keeps its height when it changes. */
const signedInLinks = [
  { label: 'Profiles', href: '/dashboard/profiles#top' },
  { label: 'Settings', href: '/dashboard/account#top' },
];

export function Footer() {
  return (
    <footer className='bg-floor text-foreground'>
      <div className='container mx-auto max-w-7xl px-6 py-6 xs:pt-12'>
        <Stagger
          className='grid gap-8 xs:grid-cols-2 md:grid-cols-[1.75fr_repeat(3,1fr)]'
          gap={0.08}
        >
          <div>
            <Link
              href='/#top'
              className='group flex items-center gap-2 text-lg font-bold'
            >
              <Logo className='h-6 w-6 group-hover:animate-wiggle' />
              Tinderhaj
            </Link>
            <p className='mt-4 max-w-xs text-sm leading-relaxed text-balance text-muted-foreground'>
              The world&apos;s first dating site exclusively for plush sharks.
            </p>
            <div className='mt-4 flex items-center gap-4'>
              <a
                href={socialLink('github')}
                target='_blank'
                rel='noreferrer'
                aria-label='Tinderhaj on GitHub'
                className='text-muted-foreground transition-colors hover:text-foreground'
              >
                <Code2 className='h-4 w-4' />
              </a>
              <Link
                href='/contact'
                aria-label='Contact Tinderhaj'
                className='text-muted-foreground transition-colors hover:text-foreground'
              >
                <Mail className='h-4 w-4' />
              </Link>
            </div>
          </div>
          <FooterColumn title='Product' links={productLinks} />
          <FooterColumn title='Community' links={communityLinks} />
          {/* Who's signed in streams in after the rest, like the navbar; until then, as for someone signed out */}
          <Suspense
            fallback={<FooterColumn title='Account' links={signedOutLinks} />}
          >
            <AccountColumn />
          </Suspense>
        </Stagger>
        <div className='mt-10 border-t border-border pt-6'>
          <div className='flex flex-col gap-6 text-xs md:flex-row md:items-center md:justify-between'>
            <p className='text-muted-foreground'>
              © 2026 Tinderhaj. All rights reserved.
            </p>
            <p className='max-w-sm text-left leading-relaxed text-muted-foreground md:text-center'>
              Blåhaj is a trademark of IKEA.
              <br />
              Tinderhaj is not affiliated with IKEA or Tinder.
            </p>
            <div className='flex gap-4 text-muted-foreground md:justify-end'>
              <Link
                href='/privacy'
                className='transition-colors hover:text-foreground'
              >
                Privacy
              </Link>
              <Link
                href='/terms'
                className='transition-colors hover:text-foreground'
              >
                Terms
              </Link>
              <Link
                href='/imprint'
                className='transition-colors hover:text-foreground'
              >
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

async function AccountColumn() {
  const session = await getSession();
  return (
    <FooterColumn
      title='Account'
      links={session ? signedInLinks : signedOutLinks}
    />
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className='text-sm font-bold'>{title}</h2>
      <div className='mt-4 flex flex-col items-start gap-2 text-sm text-muted-foreground'>
        {links.map((link) =>
          link.href.startsWith('/discovery') ? (
            <DiscoveryLink
              key={link.label}
              className='transition-colors hover:text-foreground'
            >
              {link.label}
            </DiscoveryLink>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className='transition-colors hover:text-foreground'
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
}
