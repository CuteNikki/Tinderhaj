import Image from 'next/image';
import Link from 'next/link';
import { connection } from 'next/server';

import { Github, Linkedin, Twitter } from 'lucide-react';

import { TypographyLarge, TypographyMuted, TypographyP } from '@/components/typography';

export async function Footer() {
  await connection();

  const socials = [
    { href: '#top', icon: Twitter, label: 'Twitter' },
    { href: '#top', icon: Github, label: 'GitHub' },
    { href: '#top', icon: Linkedin, label: 'LinkedIn' },
  ];

  const links = [
    {
      name: 'Product',
      items: [
        { name: 'Features', href: '/#features' },
        { name: 'Flow', href: '/#how-it-works' },
        { name: 'Testimonials', href: '/#testimonials' },
        { name: 'Discovery', href: '/discovery#top' },
      ],
    },
    {
      name: 'Resources',
      items: [
        { name: 'Community', href: '/#top' },
        // { name: 'Blog', href: '/#top' },
        // { name: 'Support', href: '/#top' },
        // { name: 'Status', href: '/#top' },
      ],
    },
    {
      name: 'Company',
      items: [
        { name: 'About', href: '/#top' },
        { name: 'Contact', href: '/#top' },
        // { name: 'Careers', href: '/#top' },
      ],
    },
  ];

  const legal = [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Imprint', href: '/imprint' },
  ];

  return (
    <footer className='bg-background w-full py-12 md:py-16'>
      <div className='container mx-auto px-4 md:px-8'>
        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Image unoptimized priority src='/blahaj.webp' alt='Logo' className='h-6 w-6' width={48} height={48} />
              <TypographyLarge className='font-bold'>Tinderhaj</TypographyLarge>
            </div>
            <TypographyMuted className='pr-8 text-sm'>{`The world's first dating site exclusively for IKEA's Blahaj plush sharks.`}</TypographyMuted>
            <div className='flex space-x-4'>
              {socials.map((social) => (
                <Link
                  key={`footer-social-${social.href}-${social.label}`}
                  href={social.href}
                  className='text-muted-foreground hover:text-primary transition-colors duration-150'
                >
                  <social.icon className='h-5 w-5' />
                  <span className='sr-only'>{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {links.map((link) => (
            <div key={`footer-link-${link.name}`} className='space-y-4'>
              <h3 className='font-medium'>{link.name}</h3>
              <nav className='flex flex-col space-y-2 text-sm'>
                {link.items.map((item) => (
                  <Link
                    key={`footer-link-${item.name}`}
                    href={item.href}
                    className='text-muted-foreground hover:text-foreground transition-colors duration-150'
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className='border-t pt-8'>
          <div className='flex flex-col items-center justify-between gap-4 text-center md:flex-row'>
            <TypographyP className='text-sm'>© {new Date().getFullYear()} Tinderhaj. All rights reserved.</TypographyP>
            <TypographyMuted className='text-sm'>
              Blåhaj is a trademark of IKEA.
              <br />
              Tinderhaj is not affiliated with IKEA or Tinder.
            </TypographyMuted>
            <div className='flex items-center gap-4 md:gap-2 lg:gap-4'>
              {legal.map((item) => (
                <Link
                  key={`footer-legal-${item.name}`}
                  href={item.href}
                  className='text-muted-foreground hover:text-foreground text-sm transition-colors duration-150'
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
