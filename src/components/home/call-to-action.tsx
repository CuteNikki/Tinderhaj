import Link from 'next/link';

import { TypographyH2, TypographyMuted } from '@/components/typography';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <section id='call-to-action' className='from-background to-muted w-full bg-gradient-to-br py-24'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <TypographyH2>Ready to Dive In?</TypographyH2>
            <TypographyMuted className='text-pretty'>
              Join thousands of Blåhaj already finding their perfect match.
              <br />
              Your shark soulmate is just a swipe away.
            </TypographyMuted>
            <div className='mx-auto flex flex-col items-center justify-center gap-2 pt-4 sm:flex-row'>
              <Button asChild>
                <Link href='/sign-up'>Create Your Profile</Link>
              </Button>
              <Button asChild variant='secondary'>
                <Link href='/discovery'>Browse Discovery</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
