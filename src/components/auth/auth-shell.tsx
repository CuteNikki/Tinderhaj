import Link from 'next/link';

import { AUTH_HEIGHT } from '@/components/auth/height';
import { Enter } from '@/components/common/enter';
import { Logo } from '@/components/common/logo';
import { HeroBadge } from '@/components/common/hero-badge';
import { Card, CardContent } from '@/components/ui/card';

export function AuthShell({
  badge,
  icon,
  title,
  description,
  children,
  footer,
}: {
  badge: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    // Set in the water from the layout (see PageWater): the band every page's header is in, stretched to fit it all, so going to or from it the water carries on and moves to fit
    <div id='page-header' data-water='full' className={`${AUTH_HEIGHT} relative flex flex-1 items-center justify-center px-4 py-28`}>
      <div className='on-water relative z-10 flex w-full max-w-md flex-col items-center'>
        <Enter variant='pop' delay={0.05}>
          <Link href='/' className='hover:animate-wiggle mb-6 flex items-center gap-2'>
            <Logo className='h-8 w-8' />
          </Link>
        </Enter>

        <HeroBadge icon={icon} delay={0.15}>
          {badge}
        </HeroBadge>

        <Enter variant='sink' delay={0.2}>
          <h1 className='mt-4 text-center text-3xl leading-none font-black tracking-tight sm:text-4xl'>{title}</h1>
        </Enter>

        <Enter variant='sink' delay={0.3}>
          <p className='text-muted-foreground mt-3 max-w-sm text-center text-sm leading-relaxed text-balance'>{description}</p>
        </Enter>

        <Enter variant='reveal' delay={0.4} className='mt-8 w-full'>
          {/* Frosted, but enough to keep the form clear of what drifts behind it */}
          <Card className='ring-glass-border bg-background/75 shadow-glass-shadow shadow-xl backdrop-blur-xl'>
            <CardContent className='pt-2'>{children}</CardContent>
          </Card>
        </Enter>

        {footer && (
          <Enter variant='reveal' delay={0.5} className='mt-6'>
            {footer}
          </Enter>
        )}
      </div>
    </div>
  );
}
