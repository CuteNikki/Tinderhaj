import Link from 'next/link';

import { Code2, Mail } from 'lucide-react';

import { GITHUB_URL } from '@/constants/contact';

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

const accountLinks = [
  { label: 'Create a profile', href: '/sign-up' },
  { label: 'Sign in', href: '/sign-in' },
];

export function Footer() {
  return (
    <footer className='bg-floor text-foreground'>
      <div className='xs:pt-12 container mx-auto max-w-7xl px-6 py-6'>
        <Stagger className='xs:grid-cols-2 grid gap-8 md:grid-cols-[1.75fr_repeat(3,1fr)]' gap={0.08}>
          <div>
            <Link href='/#top' className='group flex items-center gap-2 text-lg font-bold'>
              <Logo className='group-hover:animate-wiggle h-6 w-6' />
              Tinderhaj
            </Link>
            <p className='text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed text-balance'>
              The world&apos;s first dating site exclusively for plush sharks.
            </p>
            <div className='mt-4 flex items-center gap-4'>
              <a
                href={GITHUB_URL}
                target='_blank'
                rel='noreferrer'
                aria-label='Tinderhaj on GitHub'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Code2 className='h-4 w-4' />
              </a>
              <Link href='/contact' aria-label='Contact Tinderhaj' className='text-muted-foreground hover:text-foreground transition-colors'>
                <Mail className='h-4 w-4' />
              </Link>
            </div>
          </div>
          <FooterColumn title='Product' links={productLinks} />
          <FooterColumn title='Community' links={communityLinks} />
          <FooterColumn title='Account' links={accountLinks} />
        </Stagger>
        <div className='border-border mt-10 border-t pt-6'>
          <div className='flex flex-col gap-6 text-xs md:flex-row md:items-center md:justify-between'>
            <p className='text-muted-foreground'>© 2026 Tinderhaj. All rights reserved.</p>
            <p className='text-muted-foreground max-w-sm text-left leading-relaxed md:text-center'>
              Blåhaj is a trademark of IKEA.
              <br />
              Tinderhaj is not affiliated with IKEA or Tinder.
            </p>
            <div className='text-muted-foreground flex gap-4 md:justify-end'>
              <Link href='/privacy' className='hover:text-foreground transition-colors'>
                Privacy
              </Link>
              <Link href='/terms' className='hover:text-foreground transition-colors'>
                Terms
              </Link>
              <Link href='/imprint' className='hover:text-foreground transition-colors'>
                Imprint
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className='text-sm font-bold'>{title}</h2>
      <div className='text-muted-foreground mt-4 flex flex-col items-start gap-2 text-sm'>
        {links.map((link) =>
          link.href.startsWith('/discovery') ? (
            <DiscoveryLink key={link.label} className='hover:text-foreground transition-colors'>
              {link.label}
            </DiscoveryLink>
          ) : (
            <Link key={link.label} href={link.href} className='hover:text-foreground transition-colors'>
              {link.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
