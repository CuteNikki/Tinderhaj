'use client';

// import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

// import { Button } from '@/components/ui/button';
import {
  // DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeMenu() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );

  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger asChild>
  //       <Button variant='ghost' size='icon'>
  //         <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
  //         <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
  //         <span className='sr-only'>Toggle theme</span>
  //       </Button>
  //     </DropdownMenuTrigger>
  //     <DropdownMenuContent align='end'>
  //       <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
  //       <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // );
}
