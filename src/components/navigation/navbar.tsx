import Image from 'next/image';

import { ThemeSwitch } from '@/components/theme/switch';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className='bg-primary text-primary-foreground py-4'>
      <div className='container mx-auto px-4 flex justify-between items-center'>
        <Link href='/' className='flex items-center space-x-2'>
          <Image src='/tinderhaj.gif' alt='Tinderhaj Logo' width={40} height={40} className='rounded-full' />
          <h1 className='text-2xl font-bold'>Tinderhaj</h1>
        </Link>
        <nav>
          <ThemeSwitch />
          {/* <ul className='flex space-x-4'>
            <li>
              <a href='#features' className='hover:underline'>
                Features
              </a>
            </li>
            <li>
              <a href='#cta' className='hover:underline'>
                Join Now
              </a>
            </li>
          </ul> */}
        </nav>
      </div>
    </header>
  );
}
