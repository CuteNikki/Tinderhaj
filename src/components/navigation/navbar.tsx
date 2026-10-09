import Link from 'next/link';

import {
  ChevronDownIcon,
  HeartIcon,
  type LucideIcon,
  MailIcon,
  MenuIcon,
  MessagesSquareIcon,
  ScrollTextIcon,
  SearchIcon,
  SettingsIcon,
  SignpostIcon,
  SparklesIcon,
  UserCheckIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from 'lucide-react';

import { countUnseenHearts } from '@/lib/hearts';
import { QUERIES } from '@/lib/queries';
import type { AccountRole } from '@/lib/roles';
import { getSession, isModerator } from '@/lib/session';
import { cn } from '@/lib/utils';

import { Eyebrow } from '@/components/common/heading';
import { LogOutButton, LogOutDropdownMenuItem } from '@/components/auth/logout-button';
import { Logo } from '@/components/common/logo';
import { DiscoveryLink } from '@/components/discovery/link';
import { ThemeButton } from '@/components/theme/switch';
import { TypographyLarge } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavLink = {
  name: string;
  href: string;
  icon: LucideIcon;
  /** Shown as a count next to the link, when above 0. */
  count?: number;
  /** On the bar only from large screens up, there being no room for it beside the rest before; always in the menu. */
  wide?: boolean;
};

type NavUser = { role: AccountRole };

/** The site's pages, on the bar on wide screens and in the menu on narrow ones. Home is the logo. */
const siteLinks: NavLink[] = [
  { name: 'Guide', href: '/guide#top', icon: SignpostIcon },
  { name: 'Features', href: '/features#top', icon: SparklesIcon },
  { name: 'Discovery', href: '/discovery#top', icon: SearchIcon },
  { name: 'Community', href: '/community#top', icon: MessagesSquareIcon, wide: true },
  { name: 'Guidelines', href: '/guidelines#top', icon: ScrollTextIcon, wide: true },
  { name: 'Contact', href: '/contact#top', icon: MailIcon, wide: true },
];

/** Each group here is a page's eyebrow: "Your sharks", "Moderation", "Your account". */
function sharkLinks(unseenHearts: number): NavLink[] {
  return [
    { name: 'Profiles', href: '/dashboard/profiles#top', icon: UserRoundIcon },
    { name: 'Hearts', href: '/dashboard/hearts#top', icon: HeartIcon, count: unseenHearts },
  ];
}

/** Sits with Log out, as the other thing about you rather than your sharks. */
const accountLink: NavLink = { name: 'Settings', href: '/dashboard/account#top', icon: SettingsIcon };

export async function Navbar() {
  const session = await getSession();
  const user = session ? { role: session.user.role as AccountRole } : null;
  const [pending, hearts] = await Promise.all([
    user && isModerator(user.role) ? QUERIES.getPendingProfileCount() : 0,
    session ? countUnseenHearts(session.user.id) : 0,
  ]);

  return <NavbarContent user={user} pending={pending} hearts={hearts} showAuthElements />;
}

export function NavbarFallback() {
  return <NavbarContent user={null} pending={0} hearts={0} showAuthElements={false} />;
}

function NavbarContent({ user, pending, hearts, showAuthElements }: { user: NavUser | null; pending: number; hearts: number; showAuthElements: boolean }) {
  const yourLinks = sharkLinks(hearts);
  const moderationLinks: NavLink[] =
    user && isModerator(user.role)
      ? [
          { name: 'Verification', href: '/moderation/verification#top', icon: UserCheckIcon, count: pending },
          { name: 'Users', href: '/moderation/users#top', icon: UsersRoundIcon },
        ]
      : [];

  return (
    <header className='bg-background/60 fixed top-0 z-50 w-svw backdrop-blur-lg'>
      <nav className='container mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 md:gap-6 lg:px-8'>
        {/* Home, there being no link for it on the bar */}
        <Link href='/#top' aria-label='Tinderhaj, home' className='group mr-4 flex items-center gap-2'>
          <Logo className='group-hover:animate-wiggle h-6 w-6' />
          <TypographyLarge className='font-bold'>Tinderhaj</TypographyLarge>
        </Link>
        <div className='hidden flex-1 items-center gap-4 text-sm font-medium md:flex md:gap-6'>
          {siteLinks.map((link) => (
            <SiteLink
              key={link.href}
              link={link}
              className={cn('text-muted-foreground hover:text-foreground transition-colors duration-150', link.wide && 'hidden lg:inline')}
            />
          ))}
          {/* Until there's room for them on the bar, the rest of the pages are a click away */}
          <DropdownMenu>
            <DropdownMenuTrigger className='text-muted-foreground hover:text-foreground data-open:text-foreground flex items-center gap-1 transition-colors duration-150 lg:hidden [&[data-state=open]>svg]:rotate-180'>
              More
              <ChevronDownIcon className='size-4 transition-transform duration-150' aria-hidden='true' />
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start' className='w-44'>
              {siteLinks
                .filter((link) => link.wide)
                .map((link) => (
                  <MenuLink key={link.href} link={link} />
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeButton />

          {/* Wide screens: the site's pages are on the bar, so the menu only holds the account. */}
          {showAuthElements && (
            <div className='hidden md:block'>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='icon' className='relative'>
                      <MenuIcon />
                      <MenuDot pending={pending} hearts={hearts} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='bottom' align='end' className='w-56'>
                    <DropdownMenuGroup>
                      {yourLinks.map((link) => (
                        <MenuLink key={link.href} link={link} />
                      ))}
                    </DropdownMenuGroup>
                    {moderationLinks.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {moderationLinks.map((link) => (
                            <MenuLink key={link.href} link={link} />
                          ))}
                        </DropdownMenuGroup>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <MenuLink link={accountLink} />
                    <LogOutDropdownMenuItem />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' asChild>
                    <Link href='/sign-in'>Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/sign-up'>Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Narrow screens: everything, in one sheet. */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='outline' size='icon' className='relative'>
                <MenuIcon className='h-5 w-5' />
                <MenuDot pending={pending} hearts={hearts} />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-4/5 gap-0 sm:w-88'>
              <SheetHeader className='border-foreground/10 border-b pr-12'>
                <SheetTitle className='flex items-center gap-2'>
                  <Logo className='h-6 w-6' />
                  <span className='text-lg font-bold'>Tinderhaj</span>
                </SheetTitle>
                <SheetDescription className='text-balance'>The best place to find your perfect match</SheetDescription>
              </SheetHeader>

              <div className='flex flex-1 flex-col gap-6 overflow-y-auto p-4'>
                <SheetSection title='Explore' links={siteLinks} />
                {user && <SheetSection title='Your sharks' links={yourLinks} />}
                {moderationLinks.length > 0 && <SheetSection title='Moderation' links={moderationLinks} />}
              </div>

              {showAuthElements && (
                <SheetFooter className='border-foreground/10 border-t'>
                  {user ? (
                    <>
                      <SheetClose asChild>
                        <Button variant='outline' className='w-full' asChild>
                          <Link href={accountLink.href}>
                            <accountLink.icon aria-hidden='true' />
                            {accountLink.name}
                          </Link>
                        </Button>
                      </SheetClose>
                      <LogOutButton className='w-full' />
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button variant='outline' className='w-full' asChild>
                          <Link href='/sign-in'>Sign in</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button className='w-full' asChild>
                          <Link href='/sign-up'>Sign up</Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

/** Discovery gets a fresh shuffle each time it's opened from here. */
function SiteLink({ link, className, children }: { link: NavLink; className?: string; children?: React.ReactNode }) {
  return link.href.startsWith('/discovery') ? (
    <DiscoveryLink className={className}>{children ?? link.name}</DiscoveryLink>
  ) : (
    <Link href={link.href} className={className}>
      {children ?? link.name}
    </Link>
  );
}

/** Marks the menu button while there are new hearts, or profiles wait for review. */
function MenuDot({ pending, hearts }: { pending: number; hearts: number }) {
  const news = [hearts > 0 && `${hearts} new ${hearts === 1 ? 'heart' : 'hearts'}`, pending > 0 && `${pending} profiles waiting for review`].filter(Boolean);
  return (
    <>
      {news.length > 0 && <span className='bg-primary absolute -top-1 -right-1 size-2.5 rounded-full' aria-hidden='true' />}
      <span className='sr-only'>{['Open menu', ...news].join(', ')}</span>
    </>
  );
}

function Count({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <Badge className='ml-auto tabular-nums' aria-label={`${count} new`}>
      {count}
    </Badge>
  );
}

function MenuLink({ link }: { link: NavLink }) {
  return (
    <DropdownMenuItem asChild>
      <Link href={link.href}>
        <link.icon className='text-primary' aria-hidden='true' />
        {link.name}
        <Count count={link.count} />
      </Link>
    </DropdownMenuItem>
  );
}

function SheetSection({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <section>
      <Eyebrow as='h2' muted className='mb-1 px-3'>
        {title}
      </Eyebrow>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <SheetClose asChild>
              <SiteLink link={link} className='hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'>
                <link.icon className='text-primary size-4' aria-hidden='true' />
                {link.name}
                <Count count={link.count} />
              </SiteLink>
            </SheetClose>
          </li>
        ))}
      </ul>
    </section>
  );
}
