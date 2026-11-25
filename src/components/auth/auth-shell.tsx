import Link from 'next/link';

import { cn } from '@/lib/utils';

import { AUTH_HEIGHT } from '@/components/auth/height';
import { Enter, enter } from '@/components/common/enter';
import { HeroBadge } from '@/components/common/hero-badge';
import { Logo } from '@/components/common/logo';
import { glass, glassFields } from '@/components/common/ocean';
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
  const card = enter('reveal', 0.4);

  return (
    // Set in the water from the layout (see PageWater): the band every page's header is in, stretched to fit it all, so going to or from it the water carries on and moves to fit
    <div
      id='page-header'
      data-water='full'
      className={`${AUTH_HEIGHT} relative flex flex-1 items-center justify-center px-4 py-28`}
    >
      <div className='on-water relative z-10 flex w-full max-w-md flex-col items-center'>
        <Enter variant='pop' delay={0.05}>
          <Link
            href='/'
            className='mb-6 flex items-center gap-2 hover:animate-wiggle'
          >
            <Logo className='h-8 w-8' />
          </Link>
        </Enter>

        <HeroBadge icon={icon} delay={0.15}>
          {badge}
        </HeroBadge>

        <Enter variant='sink' delay={0.2}>
          <h1 className='mt-4 text-center text-3xl leading-none font-black tracking-tight sm:text-4xl'>
            {title}
          </h1>
        </Enter>

        <Enter variant='sink' delay={0.3}>
          <p className='mt-3 max-w-sm text-center text-sm leading-relaxed text-balance text-muted-foreground'>
            {description}
          </p>
        </Enter>

        {/* Glass, coming in on itself so it's frosted from the start (see glass) */}
        <Card
          className={cn(
            card.className,
            glass,
            glassFields,
            'mt-8 w-full border-0 shadow-xl ring-glass-border'
          )}
          style={card.style}
        >
          <CardContent className='pt-2'>{children}</CardContent>
        </Card>

        {footer && (
          <Enter variant='reveal' delay={0.5} className='mt-6'>
            {footer}
          </Enter>
        )}
      </div>
    </div>
  );
}
