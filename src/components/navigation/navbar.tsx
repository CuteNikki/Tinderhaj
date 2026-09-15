import Link from 'next/link';

import { HomeIcon, MenuIcon, MessageCircleIcon, SearchIcon, SettingsIcon, SignpostIcon, UserCheckIcon, UserRoundIcon, UserShieldIcon } from 'lucide-react';

import type { AccountModel } from '@/generated/models';
import { getCurrentUser } from '@/lib/actions';

import { LogOutButton, LogOutDropdownMenuItem } from '@/components/auth/logout-button';
import { Logo } from '@/components/common/logo';
import { DiscoveryLink } from '@/components/discovery/link';
import { ThemeButton } from '@/components/theme/switch';
import { TypographyLarge } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export async function Navbar() {
  const session = await getCurrentUser({ includeAccount: true, redirectIfNotFound: false });

  return <NavbarContent session={session} showAuthElements />;
}

export function NavbarFallback() {
  return <NavbarContent session={null} showAuthElements={false} />;
}

function NavbarContent({ session, showAuthElements }: { session: { account: AccountModel } | null; showAuthElements: boolean }) {
  const regularLinks = [
    { name: 'Home', href: '/#top', icon: HomeIcon, showOnBar: true, showInMenu: true },
    { name: 'Guide', href: '/#guide', icon: SignpostIcon, showOnBar: true, showInMenu: true },
    { name: 'Features', href: '/#features', icon: MessageCircleIcon, showOnBar: true, showInMenu: true },
    { name: 'Discovery', href: '/discovery#top', icon: SearchIcon, showOnBar: true, showInMenu: true },
  ];
  const accountLinks = [
    { name: 'Account', href: '/account#top', icon: SettingsIcon },
    { name: 'Profiles', href: '/profiles#top', icon: UserRoundIcon },
  ];
  const moderationLinks =
    session?.account?.role === 'MODERATOR' || session?.account?.role === 'ADMIN'
      ? [
          { name: 'Roles', href: '/roles#top', icon: UserShieldIcon },
          { name: 'Verification', href: '/verification#top', icon: UserCheckIcon },
        ]
      : [];

  return (
    <header className='bg-background/60 fixed top-0 z-50 w-svw backdrop-blur-lg'>
      <nav className='container mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 md:gap-6 lg:px-8'>
        <Link href='#top' className='mr-4 flex items-center gap-2'>
          <Logo className='h-6 w-6' />
          <TypographyLarge className='font-bold'>Tinderhaj</TypographyLarge>
        </Link>
        <div className='hidden flex-1 items-center gap-4 text-sm font-medium md:flex md:gap-6'>
          {regularLinks.map(
            (link, index) =>
              link.showOnBar &&
              (link.href.startsWith('/discovery') ? (
                <DiscoveryLink
                  key={`navbar-link-${index}-${link.href}-${link.name}`}
                  className='text-muted-foreground hover:text-foreground transition-colors duration-150'
                >
                  {link.name}
                </DiscoveryLink>
              ) : (
                <Link
                  key={`navbar-link-${index}-${link.href}-${link.name}`}
                  href={link.href}
                  className='text-muted-foreground hover:text-foreground transition-colors duration-150'
                >
                  {link.name}
                </Link>
              )),
          )}
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeButton />
          {showAuthElements && (
            <div className='hidden md:block'>
              {session?.account ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='icon'>
                      <MenuIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='bottom' align='end'>
                    <LogOutDropdownMenuItem />
                    {accountLinks.map((link, index) => (
                      <Link href={link.href} key={`account-dropdown-link-${index}-${link.href}`}>
                        <DropdownMenuItem>
                          <link.icon />
                          {link.name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    {moderationLinks.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        {moderationLinks.map((link, index) => (
                          <Link href={link.href} key={`moderation-dropdown-link-${index}-${link.href}`}>
                            <DropdownMenuItem>
                              <link.icon />
                              {link.name}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    {regularLinks.map(
                      (link, index) =>
                        link.showInMenu &&
                        (link.href.startsWith('/discovery') ? (
                          <DiscoveryLink key={`navdropdown-link-${index}-${link.href}-${link.name}`}>
                            <DropdownMenuItem>
                              <link.icon />
                              {link.name}
                            </DropdownMenuItem>
                          </DiscoveryLink>
                        ) : (
                          <Link href={link.href} key={`navdropdown-link-${index}-${link.href}-${link.name}`}>
                            <DropdownMenuItem>
                              <link.icon />
                              {link.name}
                            </DropdownMenuItem>
                          </Link>
                        )),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href='/sign-up'>Sign Up</Link>
                </Button>
              )}
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='outline' size='icon'>
                <MenuIcon className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-4/5 justify-center sm:w-88'>
              {session?.account ? (
                <SheetHeader className='flex flex-col items-center gap-2'>
                  <SheetTitle className='flex items-center justify-center gap-2'>
                    <div className='flex flex-col'>
                      <span className='font-bold uppercase'>@{session.account.username}</span>
                    </div>
                  </SheetTitle>
                  <LogOutButton />
                </SheetHeader>
              ) : (
                <SheetHeader>
                  <SheetTitle className='flex items-center justify-center gap-2'>
                    <Logo className='h-6 w-6' />
                    <span className='text-lg font-bold'>Tinderhaj</span>
                  </SheetTitle>
                  <SheetDescription className='text-center text-balance'>The best place to find your perfect match</SheetDescription>
                </SheetHeader>
              )}
              <nav className='flex flex-col items-center gap-4 p-6 text-center'>
                <Separator />
                {session?.account &&
                  accountLinks.map((link, index) => (
                    <SheetClose className='flex items-center gap-2' key={`account-sheet-link-${index}-${link.href}`} asChild>
                      <Link href={link.href} className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                        <link.icon className='h-4 w-4' />
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                {moderationLinks.length > 0 && (
                  <>
                    <Separator />
                    {moderationLinks.map((link, index) => (
                      <SheetClose className='flex items-center gap-2' key={`moderation-sheet-link-${index}-${link.href}`} asChild>
                        <Link href={link.href} className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                          <link.icon className='h-4 w-4' />
                          {link.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </>
                )}
                {session?.account && <Separator />}
                {regularLinks.map(
                  (link, index) =>
                    link.showInMenu &&
                    (link.href.startsWith('/discovery') ? (
                      <SheetClose className='flex items-center gap-2' key={`navsheet-link-${index}-${link.href}-${link.name}`} asChild>
                        <DiscoveryLink className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                          <link.icon className='h-4 w-4' />
                          {link.name}
                        </DiscoveryLink>
                      </SheetClose>
                    ) : (
                      <SheetClose className='flex items-center gap-2' key={`navsheet-link-${index}-${link.href}-${link.name}`} asChild>
                        <Link href={link.href} className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                          <link.icon className='h-4 w-4' />
                          {link.name}
                        </Link>
                      </SheetClose>
                    )),
                )}
                <Separator />
              </nav>
              {showAuthElements && !session?.account && (
                <div className='flex flex-col items-center gap-2 p-6'>
                  <Button variant='secondary' className='w-full' asChild>
                    <Link href='/sign-in'>Sign In</Link>
                  </Button>
                  <Button className='w-full' asChild>
                    <Link href='/sign-up'>Sign Up</Link>
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
