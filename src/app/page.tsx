import Image from 'next/image';
import Link from 'next/link';

import { ThemeButton } from '@/components/theme-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <div className='grid justify-items-center gap-4 p-8'>
        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <Button variant='destructive' asChild>
            <Link href='/users'>
              <Image src='/blahaj.webp' alt='Blahaj' width={32} height={32} />
              View Users
            </Link>
          </Button>
          <Button asChild variant='secondary'>
            <Link href='/typography'>Typography</Link>
          </Button>
          <ThemeButton />
          <Image unoptimized aria-hidden src='/blahajHug.webp' alt='Blahaj hug Blahaj' width={32} height={32} />
          <Image unoptimized aria-hidden src='/blahajHeart.webp' alt='Blahaj Heart' width={32} height={32} />
          <Image unoptimized aria-hidden src='/blahajThink.webp' alt='Blahaj Think' width={32} height={32} />
        </div>
        <Image unoptimized loading='eager' src='/blahajSpinSmall.gif' alt='Blahaj spin' width={382} height={201} />
      </div>
    </>
  );
}
