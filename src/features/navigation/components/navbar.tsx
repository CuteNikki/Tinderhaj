import Image from 'next/image';
import Link from 'next/link';

import { logo } from '@/features/navigation/constants/texts';

export function Navbar() {
  return (
    <header className='bg-primary py-4 text-primary-foreground'>
      <div className='container mx-auto flex items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src={logo.src} alt={logo.alt} width={30} height={30} unoptimized />
          <span className='font-bold'>{logo.name}</span>
        </Link>
        <nav>
          {/* <ul className='flex space-x-4'>
            <li>
              <a href='#features' className='hover:underline'>
                Features
              </a>
            </li>
            <li>
              <a href='#cta' className='hover:underline'>
                Join
              </a>
            </li>
          </ul> */}
        </nav>
      </div>
    </header>
  );
}
