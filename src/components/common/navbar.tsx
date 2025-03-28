import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpDownIcon, BadgeCheckIcon, HomeIcon, Menu, MenuIcon, MessageCircleIcon, PresentationIcon, SearchIcon, UserRoundIcon } from 'lucide-react';

import { getCurrentUser } from '@/lib/actions';

import { LogOutButton, LogOutDropdownMenuItem } from '@/components/auth/logout-button';
import { Logo } from '@/components/common/logo';
import { ThemeButton } from '@/components/common/theme-menu';
import { TypographyLarge } from '@/components/typography';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export async function Navbar() {
  const session = await getCurrentUser({ includeProfile: true, redirectIfNotFound: false });

  const links = [
    { name: 'Home', href: '/#top', icon: HomeIcon, showOnBar: true, showInMenu: true },
    { name: 'Features', href: '/#features', icon: BadgeCheckIcon, showOnBar: true, showInMenu: true },
    { name: 'Flow', href: '/#flow', icon: ArrowUpDownIcon, showOnBar: true, showInMenu: true },
    { name: 'Demo', href: '/#demo', icon: PresentationIcon, showOnBar: false, showInMenu: true },
    { name: 'Testimonials', href: '/#testimonials', icon: MessageCircleIcon, showOnBar: true, showInMenu: true },
    { name: 'Discovery', href: '/discovery#top', icon: SearchIcon, showOnBar: true, showInMenu: false },
  ];

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-background sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto flex h-16 items-center gap-4 px-4 md:gap-6 md:px-8'>
        <Link href='#top' className='mr-4 flex items-center gap-2'>
          <Logo className='h-6 w-6' />
          <TypographyLarge className='font-bold'>Tinderhaj</TypographyLarge>
        </Link>
        <nav className='hidden flex-1 items-center gap-4 text-sm font-medium md:flex md:gap-6'>
          {links.map(
            (link, index) =>
              link.showOnBar && (
                <Link
                  key={`navbar-link-${index}-${link.href}-${link.name}`}
                  href={link.href}
                  className='text-muted-foreground hover:text-foreground transition-colors duration-150'
                >
                  {link.name}
                </Link>
              ),
          )}
        </nav>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeButton />
          <div className='hidden md:block'>
            {session?.Profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom'>
                  <DropdownMenuLabel className='flex items-center gap-2'>
                    <Image
                      unoptimized
                      priority
                      draggable={false}
                      width={40}
                      height={40}
                      src={session.Profile.avatarUrl}
                      alt='Avatar'
                      className='h-10 w-10 rounded-xl select-none'
                    />
                    <div className='flex flex-col'>
                      <span>{session.Profile.displayName}</span>
                      <span className='text-muted-foreground text-sm'>@{session.Profile.username}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <LogOutDropdownMenuItem />
                  <DropdownMenuSeparator />
                  <Link href='/profile#top'>
                    <DropdownMenuItem>
                      <UserRoundIcon />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href='/discovery#top'>
                    <DropdownMenuItem>
                      <SearchIcon />
                      Discovery
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  {links.map(
                    (link, index) =>
                      link.showInMenu && (
                        <Link href={link.href} key={`navdropdown-link-${index}-${link.href}-${link.name}`}>
                          <DropdownMenuItem>
                            <link.icon />
                            {link.name}
                          </DropdownMenuItem>
                        </Link>
                      ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href='/sign-up'>Sign Up</Link>
              </Button>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='outline' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[80%] justify-center sm:w-[350px]'>
              {session?.Profile ? (
                <SheetHeader className='flex flex-col items-center gap-2'>
                  <SheetTitle className='flex items-center justify-center gap-2'>
                    <Image
                      unoptimized
                      priority
                      draggable={false}
                      width={40}
                      height={40}
                      src={session.Profile.avatarUrl}
                      alt='Avatar'
                      className='h-10 w-10 rounded-xl select-none'
                    />
                    <div className='flex flex-col'>
                      <span>{session.Profile.displayName}</span>
                      <span className='text-muted-foreground text-sm'>@{session.Profile.username}</span>
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
                {session?.Profile && (
                    <SheetClose className='flex items-center gap-2' asChild>
                      <Link href='/profile' className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                        <UserRoundIcon className='h-4 w-4' />
                        Profile
                      </Link>
                    </SheetClose>
                )}
                <SheetClose className='flex items-center gap-2' asChild>
                  <Link href='/discovery#top' className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                    <SearchIcon className='h-4 w-4' />
                    Discovery
                  </Link>
                </SheetClose>
                {session?.Profile && <Separator />}
                {links.map(
                  (link, index) =>
                    link.showInMenu && (
                      <SheetClose className='flex items-center gap-2' key={`navsheet-link-${index}-${link.href}-${link.name}`} asChild>
                        <Link href={link.href} className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                          <link.icon className='h-4 w-4' />
                          {link.name}
                        </Link>
                      </SheetClose>
                    ),
                )}
                <Separator />
              </nav>
              {!session?.Profile && (
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
      </div>
    </header>
  );
}
