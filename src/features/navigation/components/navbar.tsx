import Image from 'next/image';
import Link from 'next/link';

import { links } from '@/constants/links';
import { logo } from '@/constants/texts/navigation';

export function Navbar() {
  return (
    <header className='bg-primary py-4 text-primary-foreground'>
      <div className='container mx-auto flex items-center justify-between px-4'>
        <Link href={links.home} className='flex items-center gap-2'>
          <Image src={logo.src} alt={logo.alt} unoptimized width={48} height={25} />
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
