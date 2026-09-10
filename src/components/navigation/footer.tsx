import Link from 'next/link';

import { Code2, Mail, MessageCircle } from 'lucide-react';

import { Logo } from '@/components/common/logo';
import { DiscoveryLink } from '@/components/discovery/link';

const productLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#guide' },
  { label: 'Discovery', href: '/discovery#top' },
];

const resourceLinks = [
  { label: 'Community', href: '/#guide' },
  { label: 'Create a profile', href: '/sign-up' },
  { label: 'Sign in', href: '/sign-in' },
];

export function Footer() {
  return (
    <footer className='bg-muted text-foreground dark:bg-background'>
      <div className='xs:pt-12 container mx-auto max-w-7xl px-6 py-6'>
        <div className='xs:grid-cols-2 grid gap-8 md:grid-cols-[1.75fr_repeat(3,1fr)]'>
          <div>
            <Link href='/#top' className='flex items-center gap-2 text-lg font-bold'>
              <Logo className='h-6 w-6' />
              Tinderhaj
            </Link>
            <p className='text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed text-balance'>
              The world&apos;s first dating site exclusively for plush sharks.
            </p>
            <div className='mt-4 flex items-center gap-4'>
              <Link href='/#guide' aria-label='Tinderhaj community' className='text-muted-foreground hover:text-foreground transition-colors'>
                <MessageCircle className='h-4 w-4' />
              </Link>
              <DiscoveryLink aria-label='Tinderhaj discovery' className='text-muted-foreground hover:text-foreground transition-colors'>
                <Code2 className='h-4 w-4' />
              </DiscoveryLink>
              <Link
                href='mailto:hello@tinderhaj.example'
                aria-label='Email Tinderhaj'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <Mail className='h-4 w-4' />
              </Link>
            </div>
          </div>
          <FooterColumn title='Product' links={productLinks} />
          <FooterColumn title='Resources' links={resourceLinks} />
          <FooterColumn
            title='Company'
            links={[
              { label: 'About', href: '/#top' },
              { label: 'Contact', href: 'mailto:hello@tinderhaj.example' },
            ]}
          />
        </div>
        <div className='border-border mt-10 border-t pt-6'>
          <div className='flex flex-col gap-6 text-xs md:flex-row md:items-center md:justify-between'>
            <p className='text-muted-foreground'>© 2026 Tinderhaj. All rights reserved.</p>
            <p className='text-muted-foreground max-w-sm text-left leading-relaxed md:text-center'>
              Blåhaj is a trademark of IKEA.
              <br />
              Tinderhaj is not affiliated with IKEA or Tinder.
            </p>
            <div className='text-muted-foreground flex gap-4 md:justify-end'>
              <Link href='/#top' className='hover:text-foreground transition-colors'>
                Privacy
              </Link>
              <Link href='/#top' className='hover:text-foreground transition-colors'>
                Terms
              </Link>
              <Link href='/#top' className='hover:text-foreground transition-colors'>
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
