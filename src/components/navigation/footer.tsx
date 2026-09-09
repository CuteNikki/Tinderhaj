import Link from 'next/link';

import { Code2, Mail, MessageCircle } from 'lucide-react';

import { Logo } from '@/components/common/logo';

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
      <div className='container mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20'>
        <div className='grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <Link href='/#top' className='flex items-center gap-2 text-lg font-bold'>
              <Logo className='h-6 w-6' />
              Tinderhaj
            </Link>
            <p className='text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed'>
              The world&apos;s first dating site exclusively for IKEA&apos;s Blåhaj plush sharks.
            </p>
            <div className='mt-6 flex items-center gap-4'>
              <Link href='/#guide' aria-label='Tinderhaj community' className='text-muted-foreground hover:text-foreground transition-colors'>
                <MessageCircle className='h-4 w-4' />
              </Link>
              <Link href='/discovery#top' aria-label='Tinderhaj discovery' className='text-muted-foreground hover:text-foreground transition-colors'>
                <Code2 className='h-4 w-4' />
              </Link>
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
          <div>
            <h2 className='text-sm font-bold'>Company</h2>
            <div className='text-muted-foreground mt-5 flex flex-col items-start gap-3 text-sm'>
              <Link href='/#top' className='hover:text-foreground transition-colors'>
                About
              </Link>
              <Link href='mailto:hello@tinderhaj.example' className='hover:text-foreground transition-colors'>
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className='border-border mt-16 border-t pt-6 lg:mt-20'>
          <div className='flex flex-col gap-6 text-xs sm:flex-row sm:items-start sm:justify-between'>
            <p className='text-muted-foreground'>© 2026 Tinderhaj. All rights reserved.</p>
            <p className='text-muted-foreground max-w-sm text-left leading-relaxed sm:text-center'>
              Blåhaj is a trademark of IKEA.
              <br />
              Tinderhaj is not affiliated with IKEA or Tinder.
            </p>
            <div className='text-muted-foreground flex gap-4 sm:justify-end'>
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
      <div className='text-muted-foreground mt-5 flex flex-col items-start gap-3 text-sm'>
        {links.map((link) => (
          <Link key={link.label} href={link.href} className='hover:text-foreground transition-colors'>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
