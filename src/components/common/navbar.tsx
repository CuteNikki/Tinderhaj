import Link from 'next/link';

import { Menu } from 'lucide-react';

import { auth, signOut } from '@/lib/auth';

import { Logo } from '@/components/common/logo';
import { ThemeButton, ThemeMenu } from '@/components/common/theme-menu';
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
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export async function Navbar() {
  const links = [
    { href: '/#top', text: 'Home' },
    { href: '/#features', text: 'Features' },
    { href: '/#flow', text: 'Flow' },
    { href: '/#testimonials', text: 'Testimonials' },
    { href: '/discovery#top', text: 'Discovery' },
  ];

  const session = await auth();

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-background sticky top-0 z-50 w-full border-b backdrop-blur'>
      <div className='container mx-auto flex h-16 items-center gap-2 px-4 md:px-8 lg:gap-6'>
        <Link href='#top' className='mr-4 flex items-center gap-2'>
          <Logo className='h-6 w-6' />
          <TypographyLarge className='font-bold'>Tinderhaj</TypographyLarge>
        </Link>
        <nav className='hidden flex-1 items-center gap-4 text-sm font-medium md:flex lg:gap-6'>
          {links.map((link, index) => (
            <Link
              key={`nav-link-${index}-${link.href}-${link.text}`}
              href={link.href}
              className='text-muted-foreground hover:text-foreground transition-colors duration-150'
            >
              {link.text}
            </Link>
          ))}
        </nav>
        <div className='ml-auto flex items-center gap-2 sm:gap-4'>
          <div>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost'>Account</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Hello, {session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ThemeMenu />
                  <DropdownMenuSeparator />
                  <form
                    action={async () => {
                      'use server';
                      await signOut({ redirectTo: '/' });
                    }}
                  >
                    <DropdownMenuItem className='text-destructive'>
                      <button>Sign Out</button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='hidden items-center gap-2 md:flex'>
                <ThemeButton />
                <Button asChild size='sm'>
                  <Link href='sign-in'>Sign In</Link>
                </Button>
              </div>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button variant='outline' size='icon'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[80%] justify-between sm:w-[350px]'>
              <SheetHeader>
                <SheetTitle className='flex items-center justify-center gap-2'>
                  <Logo className='h-6 w-6' />
                  <span className='text-lg font-bold'>Tinderhaj</span>
                </SheetTitle>
                <SheetDescription className='text-center text-balance'>The best place to find your perfect match</SheetDescription>
              </SheetHeader>
              <nav className='flex flex-col items-center gap-4 p-6 text-center'>
                {links.map((link, index) => (
                  <SheetClose asChild key={`nav-link-sheet-${index}-${link.href}-${link.text}`}>
                    <Link href={link.href} className='text-muted-foreground hover:text-foreground transition-colors duration-150'>
                      {link.text}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetFooter className='mt-6'>
                {session?.user ? (
                  <></>
                ) : (
                  <SheetClose asChild>
                    <Button asChild size='sm'>
                      <Link href='sign-in'>Sign In</Link>
                    </Button>
                  </SheetClose>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
