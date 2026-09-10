'use client';

import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

type DiscoveryLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<LinkProps, 'href'> & {
    children: ReactNode;
  };

function getDiscoveryHref() {
  const seed = crypto.getRandomValues(new Uint32Array(1))[0];
  return `/discovery?s=${seed}#top`;
}

export const DiscoveryLink = forwardRef<HTMLAnchorElement, DiscoveryLinkProps>(({ children, onClick, replace, scroll, ...props }, ref) => {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return;
    }

    event.preventDefault();

    const href = getDiscoveryHref();

    if (replace) {
      router.replace(href, { scroll });
      return;
    }

    router.push(href, { scroll });
  };

  return (
    <Link ref={ref} href='/discovery#top' onClick={handleClick} scroll={scroll} {...props}>
      {children}
    </Link>
  );
});

DiscoveryLink.displayName = 'DiscoveryLink';
